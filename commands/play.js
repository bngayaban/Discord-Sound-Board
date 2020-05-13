const {Audio, FileLocation} = require("../dbObjects.js");
const { Op } = require("sequelize");
const {timeoutTime} = require('../config.js');
const {join} = require('path');
const fs = require('fs');
const Server = require('../Classes/server.js');

async function playSong(message, args) {
    const sfx = args;
    const sfxQuery = await Audio.findOne({where:{[Op.or]: [{fileName: sfx}, {nickname: sfx}]}, include: FileLocation });

    const server = Server.getServer(message.guild.id);

    if(!sfxQuery)
        return message.channel.send(`Song ${sfx} not found.`);
    
    server.queue.push([sfxQuery.get('fileName'), sfxQuery.audioDirectory.filePath]);
    console.log(server.queue);
    
    if(server.nowPlaying) {
        return message.channel.send(`Sound ${sfx} added as ${server.queue.length}${ordinalInt(server.queue.length)} in queue.`);
    }

    //join to channel and play
    try {
        const connection = await message.member.voice.channel.join();
        play(connection, message.channel, message.member.voice.channel, server);
    } catch(e) {
        console.log(e);
    }
}

async function play(connection, messageChannel, voiceChannel, server) {
    const second = 1000; //milliseconds
    const minute = 60 * second;

    // Make sure stream doesn't end early
    if(server.timeout) clearTimeout(server.timeout);

    //Play song, then modify queue
    const [song, directory] = server.queue[0];

    //this should skip encoder b/c its already opus encoded, but something is wrong on Discord's end, uncomment when discord.js updates
    //if(song.endsWith('.ogg') || song.endsWith('.oga'))
    //{
    //    console.log(join(directory, song));
    //    server.dispatcher = connection.play(fs.createReadStream(join(directory, song)), {type: 'ogg/opus'});
    //}
    //else
        server.dispatcher = connection.play(join(directory, song));
               
    server.nowPlaying = song;
    server.queue.shift();
    
    server.dispatcher.on("finish", end => {
        if(server.queue[0]) {
            play(connection, messageChannel, voiceChannel, server);
        } else {
            console.log("setting timeout");
            server.nowPlaying = "";
            server.timeout = setTimeout(() => {
                connection.disconnect();
                },
                timeoutTime * minute);
        }
    });
}

//https://stackoverflow.com/a/39466341
function ordinalInt(n) {
    return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
}

module.exports = {
    name: 'play',
    description: 'Play a sound',
    args: true,
    numArgs: 1,
    usage: '<sound name>',
    voice: true,
    execute(message, args) {
        return playSong(message, args);
    },
}