const Database = require("../dbObjects.js");
const { Op } = require("sequelize");
const path = './Audio/';

function ordinalInt(n) {
    return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
} //https://stackoverflow.com/a/39466341

async function play(connection, messageChannel, voiceChannel, server) {
    server.dispatcher = connection.play(`${path}${server.queue[0]}`);
    server.nowPlaying = server.queue[0];
    server.queue.shift();
    
    server.dispatcher.on("finish", end => {
        if(server.queue[0])
            play(connection, messageChannel, voiceChannel, server);
        else {
            server.nowPlaying = "";
            connection.disconnect();
        }
    });
}

async function playSong(message, args, servers) {
    let sfx = args;
    const sfxQuery = await Database.findOne({where:{[Op.or]: [{fileName: sfx}, {tags: sfx}]} });

    if(!servers[message.guild.id]) {
        servers[message.guild.id] = {
            queue: [],
        };
    } //creates server for containing song queue and nowPlaying

    var server = servers[message.guild.id];

    if(sfxQuery) {
        server.queue.push(sfxQuery.get('fileName'));
        console.log(server.queue);
        if(server.nowPlaying)
            message.channel.send(`Sound ${sfx} added as ${server.queue.length}${ordinalInt(server.queue.length)} in queue.`);

            console.log(message.channel.guild.voice);

        if(!message.channel.guild.voice || !message.channel.guild.voice.connection)// first way around need to check if voice exists, afterwards need to check if it's connected
            message.member.voice.channel.join().then(connection => {
                play(connection, message.channel, message.member.voice.channel, server);
            }).catch(err => console.log(err));
        return;
    }
    else {
        return message.channel.send(`Song ${sfx} not found.`);
    }
}

module.exports = {
    name: 'play',
    description: 'Play a sound',
    execute(message, args, servers) {
        return playSong(message, args, servers);
    },
}