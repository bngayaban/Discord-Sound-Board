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

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
    const extensions = ['.ogg', '.mp3', '.wav'];

    let files = [];
    for(folder of audioDirectories)
        files = files.concat(fs.readdirSync(folder));

    
    let filteredFiles = [];
    for(ext of extensions)
        filteredFiles = filteredFiles.concat(files.filter(file => file.endsWith(ext)));

    const filesNoExt = filteredFiles.map((file) => {return file.split('.').slice(0, -1).join('.').toLowerCase()}); //https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
    let promises = [];

    for(let i = 0; i < files.length; i++) {
        promises.push(Audio.upsert({ fileName: files[i], tags: filesNoExt[i]}));
        console.log("Added: ", files[i]); 
    }

    await Promise.all(promises);
    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);