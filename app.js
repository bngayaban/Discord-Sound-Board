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

// !help command, message event + message object
client.on("message", msg => {
    const soundBoardPrefix = "!sb";
    const commandPrefix = "--";
    const voiceChannel = msg.member.voice.channel;
    const messageChannel = msg.channel;

    if(!msg.content.startsWith(soundBoardPrefix) || msg.author.bot) return;

    if(!voiceChannel)
    {
        return msg.reply('you need to be in a voice channel to use.');
    }
    console.log(msg.content);
    const args = msg.content.slice(soundBoardPrefix.length).split(" ").filter(x => x).map((item)=>{return item.toLowerCase()}); //removes the soundboard prefix and seperates by spaces and lowercases
    console.log(args);
    const sfx = args[0];

    if(args.length < 1) {
        return messageChannel.send("One or more arguments missing. Type: !sb --help for more information.");
    }
    else if(args[0].startsWith(commandPrefix)) { //run a command
        const command = args[0].slice(commandPrefix.length);

        if(command === "help")
            return messageChannel.send("Available Commands: --help --update --list --play" );
        
        if(command === "update")
        {
            if(args.length != 3)
                return messageChannel.send("Update requires 3 arguments");
            else
                return updateTag(args[1], args[2], messageChannel);
        }

        if(command === "list") {
            return listSongs(messageChannel);
        }

        if(command === "play") {
            console.log(sfx, args[1]);
            return playSong(args[1], messageChannel, voiceChannel);
        }

        if(command === "skip") {
            return skip(messageChannel);
        }
        
        if(command === "stop")
            return stop();
        return messageChannel.send(`Command ${args[0]} not found. Try !sb --help for more options.`)
    }
    else {
        playSong(sfx, messageChannel, voiceChannel);
    }

});

async function listSongs(messageChannel) {
    const songs = await Database.findAll({attributes: ['tags']});
    const songList = songs.map(s => s.tags).join(', ') || "No songs.";

    return messageChannel.send(`List of songs: ${songList}`);
}

async function updateTag(oldTag, newTag, messageChannel){
    const changedRows = await Database.update({ tags: newTag}, {where: { tags: oldTag}});
    if(changedRows > 0) {
        return messageChannel.send(`Tag ${oldTag} was updated to ${newTag}`);
    }
        return messageChannel.send(`Tag ${oldTag} not found.`);
}

async function playSong(sfx, messageChannel, voiceChannel) {
    const sfxQuery = await Database.findOne({where:{[Op.or]: [{fileName: sfx}, {tags: sfx}]} });
    if(sfxQuery) {
        
        queue.push(sfxQuery.get('fileName'));
        messageChannel.send(`Sound ${sfx} added as ${queue.length}${ordinalInt(queue.length)} in queue.`);
        if(!messageChannel.guild.voiceConnection)
            voiceChannel.join().then(connection => {
                if(queue.length == 1) play(connection, messageChannel, voiceChannel);
            }).catch(err => console.log(err));
        return;
    }
    else {
        return messageChannel.send(`Song ${sfxName} not found.`);
    }
}

async function skip(messageChannel) {
    if(!queue.length)
        return messageChannel.send("Queue is empty. No need to skip.");
    else
    {
        if(dispatcher)
            return dispatcher.end();
    } 
}

async function stop() {
    if(dispatcher)
    {
        queue = [];
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
    
    
    dispatcher.on("finish", end => {
        queue.shift();
        if(queue[0])
            play(connection, messageChannel, voiceChannel);
        else
            connection.disconnect();
    });


}

// Log in the bot with the token
client.login(token);