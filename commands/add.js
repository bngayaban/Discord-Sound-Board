const axios = require('axios');
const {promises: fs, createWriteStream} = require('fs');
const path = require('path');
const {audioDirectories, maxFileSize, normalize} = require('../config.js');
const {normalizeAudio} = require('../audioNormalizer.js');
const {Audio, FileLocation} = require('../dbObjects.js');

async function add(message, args) {
    const attachment = message.attachments.first(); //assume only 1 attachment
    const url = attachment.url
    let fileName = url.split('/').pop();
    let nickname = args[0];
    let outputDir = audioDirectories[0];
    const uid = message.author.id;

    console.log(url);
    
    // check if attachment exists
    if(!url) return message.channel.send("No attachment found.");
    
    //check if file exists
    if(await fileExist(path.join(audioDirectories[0], fileName))) {
        return message.channel.send(`${fileName} already exists please rename and try again.`);
    }

    //check if nickname exists in database
    if(nickname) {
        nickname = nickname.toLowerCase();
        const query = await Audio.findOne({where:{nickname: nickname}});
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
        

        if(normalize){
            ({outputFile: fileName} = await normalizeFile(fileName));
            console.log(`Successfully Normalized: ${fileName}`);
        }
        

        //update database with new file and nickname
        await updateDB (fileName, nickname, uid, outputDir);
        return message.channel.send(`${fileName} added as ${nickname}`);
    } catch (error) {
        return message.channel.send(`${error}`);
    }
}

async function fileExist(file) {
    let fileExist = true;

    try {
        await fs.access(file);
    } catch(e) {
        fileExist = false;
    }
    return fileExist;
}

//https://github.com/milutinke/Discord-Server-Channel-Attachment-Downloader-BOT/blob/master/download.js
async function download(fileName, url) {
    const audioDir = path.dirname(__dirname);
    const dirPath = path.resolve(audioDir, audioDirectories[0]);
    const megabyte = 1000000;
    console.log(dirPath)
    if(!await fileExist(dirPath))
        await fs.mkdir(dirPath);

    const filePath = path.join(dirPath, `${fileName}`);
    console.log(filePath)
    
    const headers = await axios.head(url);
    if(headers.headers['content-length'] > maxFileSize * megabyte) {
        return new Promise((resolve, reject) => {
            reject(Error(`File can not exceed ${maxFileSize} megabytes.`))
        })
    }

    const writer = createWriteStream(filePath);
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

async function normalizeFile(filename) {
    const audioDir = path.dirname(__dirname);
    const dirPath = path.resolve(audioDir, audioDirectories[0]);

    const output = await normalizeAudio({
            [dirPath]: [filename]
        }, {
        }, {
            extension: '.ogg',
            append: '_norm'
        }
    );

    const outputDir = output[0].value.info.output;
    const outputFile = path.basename(outputDir);
    return {outputDir: outputDir, outputFile: outputFile};
}

async function updateDB(file, nickname, uid, outputDir) {
    if(normalize) {
        outputDir = normalizeAudio.getNormalizedDirectory(outputDir);
    }

    try {
        const directoryQuery = await FileLocation.findOne({
            where:{filePath: outputDir}
        });
        console.log(outputDir);
        const entry = await Audio.create({
            fileName: file,
            nickname: nickname,
            uid: uid,
        });
        await entry.setAudioDirectory(directoryQuery);
    } catch (error) {
        return Promise.reject(new Error(`Failed to add: ${file}\n${error}`));
    }   
}

module.exports = {
    name: 'add',
    description: 'Add a sound file to be played',
    usage: '<prefix><command name> <file to add> {nickname}',
    optionalArgs: 1,
    attachments: true,
    execute(message, args) {
        return add(message, args);
    },
};