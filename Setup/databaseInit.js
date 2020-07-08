const Sequelize = require('sequelize');
const {promises: fs} = require('fs');
const {audioDirectories, normalize} = require('../config.js');
const {normalizeAudio} = require('../Classes/audioNormalizer.js');
const {resolve: pathResolve} = require('path');
const DirectoryUtility = require('../Classes/directoryUtility');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: locateDatabase(),
});

const Audio = require('../models/audio.js')(sequelize, Sequelize.DataTypes);
const FileLocation = require('../models/location.js')(sequelize, Sequelize.DataTypes);
const Tag = require('../models/tag.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

Audio.belongsTo(FileLocation);
FileLocation.hasMany(Audio);

Audio.belongsToMany(Tag, {through: 'AudioTag'});
Tag.belongsToMany(Audio, {through: 'AudioTag'});

const User = require('../models/user.js')(sequelize, Sequelize.DataTypes);
const Permission = require('../models/permissions.js')(sequelize, Sequelize.DataTypes);

User.belongsToMany(Permission, {as: 'Permission', through: 'Rules'});
Permission.belongsToMany(User, {as: 'Permission', through: 'Rules'});


(async () => {
    if(require.main !== module)
        return;
    try {
        await syncDatabase({force});
        console.log('taco')
    } catch (e) {
        console.error;
    }
})();

async function syncDatabase() {
    try {
        await sequelize.sync();
    } catch (e) {
        console.log(e)
    }
    
    let promises = await addPermissionsToDatabase();

    await Promise.all(promises);

    for(let [index, directory] of audioDirectories.entries()) {

        if(! await DirectoryUtility.isDirectory(directory)) {
            console.log(`Could not access: ${directory} \nCheck spelling and run again.`)
            continue;
        }
        
        if(normalize && index === 0) {
            directory = normalizeAudio.getNormalizedDirectory(directory);
        }
        const [dir, created ] = await addDirectoryToDatabase(directory);

        let audioFiles = await gatherAudioFiles(directory);

        if(!created) {
            const dirAudio = await dir.getAudios();
            audioFiles = await removeDuplicateFiles(dirAudio, audioFiles);
        }
        
        //removes the extension
        const audioFilesNoExt = DirectoryUtility.toNickname(audioFiles, (index === 0 && normalize));
        await addAudioFilesToDatabase(audioFiles, audioFilesNoExt);

        const associates = await associateFilesToDirectory(dir);
        await Promise.all(associates);
    }

    console.log('Database Synced');
    sequelize.close();
};

// Determine if the file is being ran locally and returns the appropriate file path.
function locateDatabase(){
    if(require.main === module) {
        return pathResolve('../Database/database.sqlite');
    } else {
        return pathResolve('./Database/database.sqlite');
    }
}

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
        return [];
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
    
    const databaseAudioFileNames = databaseAudio.map(entry => entry.fileName);
    
    const {uniqueToA: filesToAdd, uniqueToB: filesToRemove} = DirectoryUtility.findUniqueFiles(directoryAudio, databaseAudioFileNames);

    for(const file of filesToRemove) {
        console.log(`Removing: ${file} from database.`)
        await (databaseAudio.find(entry => entry.fileName === file)).destroy();
    }

    return filesToAdd;
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

module.exports = {
    syncDatabase
};