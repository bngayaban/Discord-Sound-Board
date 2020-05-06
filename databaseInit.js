const Sequelize = require('sequelize');
const {promises: fs} = require('fs');
const {audioDirectories} = require('./config.js');
const path = require('path');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Database/database.sqlite',
});

const Audio = sequelize.import('models/audio.js');
const FileLocation = sequelize.import('models/location.js');
const force = process.argv.includes('--force') || process.argv.includes('-f');

Audio.FileLocation = Audio.belongsTo(FileLocation);
FileLocation.hasMany(Audio);

const User = sequelize.import('models/user.js');
const Permission = sequelize.import('models/permissions.js');

User.belongsToMany(Permission, {as: 'Permission', through: 'Rules'});
Permission.belongsToMany(User, {as: 'Permission', through: 'Rules'});


sequelize.sync({force}).then(async () => {

    let promises = await addPermissionsToDatabase();

    await Promise.all(promises);

    for(let directory of audioDirectories) {
        const [dir, _ ] = await addDirectoryToDatabase(directory);

        const {audioFiles, audioFilesNoExt} = await gatherAudioFiles(directory);

        await addAudioFilesToDatabase(audioFiles, audioFilesNoExt);

        const associates = await associateFilesToDirectory(dir);
        await Promise.all(associates);
    }

    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);


async function addPermissionsToDatabase() {
    const permissionsToAdd = ['add', 'play', 'modify'];

    let promises = [];

    for(let p of permissionsToAdd) {
        promises.push(Permission.upsert({name: p}));
    }
    return promises;
}

async function addDirectoryToDatabase(directory) {
    return FileLocation.findOrCreate({
        where:{
            filePath: directory
        }
    });
}

async function gatherAudioFiles(directory) {
    const extensions = ['.ogg', '.mp3', '.wav', '.oga'];

    // https://stackoverflow.com/a/58332163
    let files;
    try {
        files = await fs.readdir(directory);
    }
    catch (e) {
        console.log(e);
    }
    
    if(files === undefined) {
        console.log(`No files found in ${directory}`);
        return {audioFiles: [], audioFilesNoExt: []};
    }

    let audioFiles = [];
    for(const ext of extensions)
        audioFiles = audioFiles.concat(files.filter(file => file.endsWith(ext)));

    const audioFilesNoExt = audioFiles.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()});

    return {audioFiles, audioFilesNoExt};
}

async function addAudioFilesToDatabase(files, filesNoExt) {
    let entries = [];
    
    for(let i = 0; i < files.length; i++) {
        entries.push({
            fileName: files[i],
            nickname: filesNoExt[i],
            uid: 'SELF',
        });
        console.log(`Adding: ${files[i]} as ${filesNoExt[i]}`)
    }

    return Audio.bulkCreate(entries, {
        ignoreDuplicates: true
    });
}

async function associateFilesToDirectory(dir) {
    let audioEntries = await Audio.findAll({
        where: {
            audioDirectoryId: null
        }
    });

    let promises = [];
    for(const entry of audioEntries) {
        promises.push(entry.setAudioDirectory(dir));
    }
    return promises;
}