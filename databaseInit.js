const Sequelize = require('sequelize');
const {promises: fs} = require('fs');
const {audioDirectories} = require('./config.js');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Database/database.sqlite',
});

const Audio = sequelize.import('models/audio.js');
const FileLocation = sequelize.import('models/location.js');
const Tag = sequelize.import('models/tag.js');

const force = process.argv.includes('--force') || process.argv.includes('-f');

Audio.FileLocation = Audio.belongsTo(FileLocation);
FileLocation.hasMany(Audio);

Audio.belongsToMany(Tag, {through: 'AudioTag'});
Tag.belongsToMany(Audio, {through: 'AudioTag'});

const User = sequelize.import('models/user.js');
const Permission = sequelize.import('models/permissions.js');

User.belongsToMany(Permission, {as: 'Permission', through: 'Rules'});
Permission.belongsToMany(User, {as: 'Permission', through: 'Rules'});


sequelize.sync({force}).then(async () => {

    let promises = await addPermissionsToDatabase();

    await Promise.all(promises);

    for(let directory of audioDirectories) {
        const [dir, created ] = await addDirectoryToDatabase(directory);

        let audioFiles = await gatherAudioFiles(directory);

        if(!created) {
            const dirAudio = await dir.getAudios();
            audioFiles = await removeDuplicateFiles(dirAudio, audioFiles);
        }
        
        const audioFilesNoExt = removeExtension(audioFiles);
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

    

    return audioFiles;
}

// if the directory already exists in the database, need to check if the files in the directory match the database
// if file exists in database but not in directory, delete record
// if file does not exist in database but in directory, add to list of files to add
async function removeDuplicateFiles(databaseAudio, directoryAudio) {

    databaseAudio.sort((a, b) => {  
                    if (a.fileName > b.fileName) {
                            return 1;
                        } else if (a.fileName < b.fileName) {
                            return -1;
                        } else {
                            return 0;
                        }   
                    });
                    
    directoryAudio.sort();

    let filesToAdd = [];
    let i = 0, j = 0;
    while( i < directoryAudio.length && j < databaseAudio.length) {
        if(directoryAudio[i] > databaseAudio[j].fileName) {
            console.log(`Removing ${databaseAudio[j].fileName} from database.`);
            await databaseAudio[j].destroy();
            j++;
        } else if (directoryAudio[i] < databaseAudio[j].fileName) {
            filesToAdd.push(directoryAudio[i]);
            i++;
        } else {
            i++;
            j++;
        }
    }

    while ( j < databaseAudio.length) {
        console.log(`Removing ${databaseAudio[j].fileName} from database.`);
        await databaseAudio[j].destroy();
        j++;
    }
    while ( i < directoryAudio.length) {
        filesToAdd.push(directoryAudio[i]);
        i++;
    }
        
    return filesToAdd;
}

function removeExtension(directoryAudio) {
    return directoryAudio.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()});
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

    if(audioEntries.length === 0 ) {
        console.log(`No new files from ${dir.filePath} to add.`)
    }

    let promises = [];
    for(const entry of audioEntries) {
        promises.push(entry.setAudioDirectory(dir));
    }
    return promises;
}