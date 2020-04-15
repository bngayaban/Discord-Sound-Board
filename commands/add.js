const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {audioDirectories, FileLocation} = require('../config.js');
const {Audio} = require('../dbObjects.js');

async function add(message, args) {
    const attachment = message.attachments.first(); //assume only 1 attachment
    const url = attachment.url
    const fileName = url.split('/').pop();
    let nickname = args[0];

    console.log(url);
    
    // check if attachment exists
    if(!url) return message.channel.send("No attachment found.");
    //check if file exists
    if(fs.existsSync(`${audioDirectories[0]}/${fileName}`)) {
        return message.channel.send(`${fileName} already exists please rename and try again.`);
    }
    //check if nickname exists in database
    if(nickname) {
        nickname = nickname.toLowerCase();
        const query = await Audio.findOne({where:{tags: nickname}});
        if(query) {
            message.channel.send(`${nickname} already exists in database. Using default instead.`);
            nickname = fileName.split('.').slice(0, -1).join('.').toLowerCase();
        }
    } else {
        nickname = fileName.split('.').slice(0, -1).join('.').toLowerCase();
    }
    
    try {
        // start downloading after checks
        await download(fileName, url);
        console.log(`Successfully Downloaded: ${url}`);
        
        //update database with new file and nickname
        await updateDB(fileName, nickname);
        return message.channel.send(`${fileName} added as ${nickname}`);
    } catch (error) {
        return message.channel.send(`Error: ${error}`);
    }
}

//https://github.com/milutinke/Discord-Server-Channel-Attachment-Downloader-BOT/blob/master/download.js
async function download(fileName, url) {
    const audioDir = path.dirname(__dirname);
    const dirPath = path.resolve(audioDir, audioDirectories[0]);
    const megabyte = 1000000;
    console.log(dirPath)
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);

    const filePath = path.join(dirPath, `${fileName}`);
    console.log(filePath)
    
    const headers = await axios.head(url);
    if(headers.headers['content-length'] > 6 * megabyte) {
        return new Promise((resolve, reject) => {
            reject(Error(`File can not exceed ${6 * megabyte} megabytes.`))
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
    try {
        const entry = await Audio.create({
            fileName: file,
            tags: nickname
        });
        await entry.setAudioDirectory(1);
    } catch (error) {
        return Promise.reject(new Error(`Failed to add: ${file}\n${error}`));
    }   
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