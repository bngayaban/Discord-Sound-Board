const Database = require("../dbObjects.js");
const { Op } = require("sequelize");

function ordinalInt(n) {
    return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
} //https://stackoverflow.com/a/39466341

async function play(connection, messageChannel, voiceChannel) {
    dispatcher = connection.play(`${path}${queue[0]}`);
    nowPlaying = queue[0];
    queue.shift();
    
    dispatcher.on("finish", end => {
        if(queue[0])
            play(connection, messageChannel, voiceChannel);
        else {
            nowPlaying = "";
            connection.disconnect();
        }

    });
}

async function playSong(message, args) {
    let sfx = args;
    const sfxQuery = await Database.findOne({where:{[Op.or]: [{fileName: sfx}, {tags: sfx}]} });
    if(sfxQuery) {
        queue.push(sfxQuery.get('fileName'));
        console.log(queue);
        if(nowPlaying)
            message.channel.send(`Sound ${sfx} added as ${queue.length}${ordinalInt(queue.length)} in queue.`);

            console.log(message.channel.guild.voice);

        if(!message.channel.guild.voice || !message.channel.guild.voice.connection)// first way around need to check if voice exists, afterwards need to check if it's connected
            message.member.voice.channel.join().then(connection => {
                play(connection, message.channel, message.member.voice.channel);
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
    execute(message, args) {
        return playSong(message, args);
    },
}