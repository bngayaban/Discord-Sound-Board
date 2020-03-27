// Require discord.js package
const Discord = require("discord.js");
const Database = require("./dbObjects.js");
const { Op } = require("sequelize");
const path = './Audio/';

const fs = require('fs');

// Create a new client using the new keyword
const client = new Discord.Client();

// Accessing the token ./token.json
const {
    token
} = require("./token.json");

// Display a message once the bot has started
client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
});


client.once('ready', () => {
    Database.sync();
});

// When the bot is reconnecting to the websocket
client.on("reconnecting", () =>{
    console.log(`This bot is reconnecting: ${client.user.tag}`);
});

// When the bot disconnects from the websocket
client.on("disconnect", () =>{
    console.log(`This bot is now disconnected: ${client.user.tag}`);
});

let queue = [];
let dispatcher = "";
let nowPlaying = "";

// !help command, message event + message object
client.on("message", msg => {
    const soundBoardPrefix = "!sb";
    const commandPrefix = "--";

    if(!msg.content.startsWith(soundBoardPrefix) || msg.author.bot) return;

    if(!msg.member.voice.channel)
    {
        return msg.reply('you need to be in a voice channel to use.');
    }
    console.log(msg.content);
    const args = msg.content.slice(soundBoardPrefix.length).split(" ").filter(x => x).map((item)=>{return item.toLowerCase()}); //removes the soundboard prefix and seperates by spaces and lowercases
    console.log(args);
    const sfx = args[0];

    if(args.length < 1) {
        return msg.channel.send("One or more arguments missing. Type: !sb --help for more information.");
    }
    else if(args[0].startsWith(commandPrefix)) { //run a command
        const command = args[0].slice(commandPrefix.length);

        if(command === "help")
            return msg.channel.send("Available Commands: --help --update --list --play" );
        
        if(command === "update")
        {
            if(args.length != 3)
                return msg.channel.send("Update requires 3 arguments");
            else
                return updateTag(msg, args);
        }

        if(command === "list") {
            return listSongs(msg, args);
        }

        if(command === "play") {
            console.log(sfx, args[1]);
            return playSong(msg, args[1]);
        }

        if(command === "skip") {
            return skip(msg, args);
        }
        
        if(command === "stop")
            return stop(msg, args);
        return msg.channel.send(`Command ${args[0]} not found. Try !sb --help for more options.`)
    }
    else {
        return playSong(msg, args[0]);
    }

});

async function listSongs(message, args) {
    const songs = await Database.findAll({attributes: ['tags']});
    const songList = songs.map(s => s.tags).join(', ') || "No songs.";

    return message.channel.send(`List of songs: ${songList}`);
}

async function updateTag(message, args){
    let oldTag = args[1];
    let newTag = args[2];
    const changedRows = await Database.update({ tags: newTag}, {where: { tags: oldTag}});

    if(changedRows > 0) {
        return message.channel.send(`Tag ${oldTag} was updated to ${newTag}`);
    }
        return message.channel.send(`Tag ${oldTag} not found.`);
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

async function skip(message, args) {
    if(dispatcher)
        return dispatcher.end();
    else
        return message.channel.send("Queue is empty. No need to skip.");
}

async function stop(message, args) {
    if(dispatcher)
    {
        queue = [];
        nowPlaying = "";
        dispatcher.end();
    }
}

function ordinalInt(n)
{
    return [,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
} //https://stackoverflow.com/a/39466341


async function play(connection, messageChannel, voiceChannel)
{

    dispatcher = connection.play(`${path}${queue[0]}`);
    nowPlaying = queue[0];
    queue.shift();
    
    dispatcher.on("finish", end => {
        if(queue[0])
            play(connection, messageChannel, voiceChannel);
        else
        {
            nowPlaying = "";
            connection.disconnect();
        }

    });


}

// Log in the bot with the token
client.login(token);