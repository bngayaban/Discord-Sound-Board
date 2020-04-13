const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {audioDirectories, FileLocation} = require('../config.js');
const {Audio} = require('../dbObjects.js');

async function add(message, args) {
    const attachment = message.attachments.first(); //assume only 1 attachment
    const url = attachment.url
    const fileName = url.split('/').pop();
    let nickname = args[0].toLowerCase();

    console.log(url);
    
    if(!url) return message.channel.send("No attachment found.");
    if(nickname) {
        const query = await Audio.findOne({where:{tags: nickname}});

        if(query) {
            message.channel.send(`${nickname} already exists in database. Using default instead.`);
            nickname = fileName.split('.').slice(0, -1).join('.').toLowerCase();
        }    
    }

    await download(fileName, url)
        .then(() => {
            console.log(`Successfully Downloaded: ${url}`)
        })
        .catch(error => {
            console.log(`Failed to download: ${url}\n${error}`)
            message.channel.send(`Error: ${error}`);
        });

    await updateDB(fileName, nickname);

    return message.channel.send(`${fileName} added as ${nickname}`);
}

//https://github.com/milutinke/Discord-Server-Channel-Attachment-Downloader-BOT/blob/master/download.js
async function download(fileName, url) {
    const audioDir = path.dirname(__dirname);
    const dirPath = path.resolve(audioDir, audioDirectories[0]);
    console.log(dirPath)
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);

    const filePath = path.join(dirPath, `${fileName}`);
    console.log(filePath)

    if(fs.existsSync(filePath)) {
        return new Promise((resolve, reject) => {
            reject('File with same name already in system.');
        })
    }
       
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function updateDB(file, nickname) {
    const entry = await Audio.create({
        fileName: file,
        tags: nickname
    });

    await entry.setAudioDirectory(1);
}

module.exports = {
    name: 'add',
    description: 'Add a sound file to be played',
    usage: '<prefix><command name> <file to add> <optional nickname>',
    optionalArgs: 1,
    attachments: true,
    execute(message, args) {
        return add(message, args);
    },
};