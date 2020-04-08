const Sequelize = require('sequelize');
const fs = require('fs');
const {audioDirectories} = require('./config.js');
const path = require('path');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Audio = sequelize.import('models/audio.js');
const FileLocation = sequelize.import('models/location.js');
const force = process.argv.includes('--force') || process.argv.includes('-f');

Audio.FileLocation = Audio.belongsTo(FileLocation);
FileLocation.hasMany(Audio);

console.log(Audio.FileLocation)
sequelize.sync({force}).then(async () => {
    const extensions = ['.ogg', '.mp3', '.wav'];

    for(let directory of audioDirectories) {
        const dir = await FileLocation.create({file_location: directory});

        const files = fs.readdirSync(directory);

        let filteredFiles = [];
        for(ext of extensions)
            filteredFiles = filteredFiles.concat(files.filter(file => file.endsWith(ext)));

        const filesNoExt = filteredFiles.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()});
        
        let entries = [];
        for(let i = 0; i < filteredFiles.length; i++) {
            entries.push({
                fileName: filteredFiles[i],
                tags: filesNoExt[i],
            });
        }
        await Audio.bulkCreate(entries);

        let thing1 = await Audio.findAll({
            where: {
                audioLocationId: null
            }
        });
        let promises = [];
        for(let thing of thing1) {
            promises.push(thing.setAudio_location(dir));
        }
        await Promise.all(promises);
    }

    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);