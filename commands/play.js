const Database = require("../dbObjects.js");
const { Op } = require("sequelize");
const {audioDirectory, timeoutTime} = require('../config.js');

function ordinalInt(n) {
    return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
} //https://stackoverflow.com/a/39466341

async function play(connection, messageChannel, voiceChannel, server) {
    const second = 1000; //milliseconds
    const minute = 60 * second;

    // Make sure stream doesn't end early
    if(server.timeout) clearTimeout(server.timeout);

    //Play song, then modify queue
    server.dispatcher = connection.play(`${audioDirectory}${server.queue[0]}`);
    server.nowPlaying = server.queue[0];
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

async function playSong(message, args, servers) {
    const sfx = args;
    const sfxQuery = await Database.findOne({where:{[Op.or]: [{fileName: sfx}, {tags: sfx}]} });

    if(!servers[message.guild.id]) {
        servers[message.guild.id] = {
            queue: [],
        };
    } //creates server for containing song queue and nowPlaying

    const server = servers[message.guild.id];

    if(sfxQuery) {
        server.queue.push(sfxQuery.get('fileName'));
        console.log(server.queue);
        
        if(server.nowPlaying) {
            return message.channel.send(`Sound ${sfx} added as ${server.queue.length}${ordinalInt(server.queue.length)} in queue.`);
        }

        if(message.member.voice.channel) {
            message.member.voice.channel.join().then(connection => {
                play(connection, message.channel, message.member.voice.channel, server);
            }).catch(err => console.log(err));
        }
            
        return;
    }
    else {
        return message.channel.send(`Song ${sfx} not found.`);
    }
}

module.exports = {
    name: 'play',
    description: 'Play a sound',
    args: true,
    numArgs: 1,
    usage: '<sound name>',
    voice: true,
    execute(message, args, servers) {
        return playSong(message, args, servers);
    },
}