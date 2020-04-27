const Sequelize = require('sequelize');
const fs = require('fs');
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

sequelize.sync({force}).then(async () => {
    for(let directory of audioDirectories) {
        const [dir, _ ] = await FileLocation.findOrCreate({
            where:{
                filePath: directory
            }
        });

        const filteredFiles = filterFiles(directory);
        
        let entries = [];
        for(let i = 0; i < filteredFiles[0].length; i++) {
            entries.push({
                fileName: filteredFiles[0][i],
                nickname: filteredFiles[1][i],
                uid: 'SELF',
            });
        }

        await Audio.bulkCreate(entries, {
            updateOnDuplicate: ['fileName']
        });

        let audioEntries = await Audio.findAll({
            where: {
                audioDirectoryId: null
            }
        });

        let promises = [];
        for(const entry of audioEntries) {
            promises.push(entry.setAudioDirectory(dir));
        }
        await Promise.all(promises);
        
    }

    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);

function filterFiles(directory) {
    const extensions = ['.ogg', '.mp3', '.wav'];

    const files = fs.readdirSync(directory);
    
    let filteredFiles = [];
    for(const ext of extensions)
        filteredFiles = filteredFiles.concat(files.filter(file => file.endsWith(ext)));

    const filesNoExt = filteredFiles.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()});

    return [filteredFiles, filesNoExt];
}