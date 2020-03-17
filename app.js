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

let isReady = true;

// !help command, message event + message object
client.on("message", msg => {
    const soundBoardPrefix = "!sb";
    const commandPrefix = "--";
    const voiceChannel = msg.member.voice.channel;
    const messageChannel = msg.channel;

    if(!isReady) return;

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
            return messageChannel.send("This is the help command.");
        
        if(command === "update")
        {
            if(args.length != 3)
                return messageChannel.send("Update requires 3 arguments");
            else
                return updateTag(args[1], args[2], messageChannel);
        }
            
    }
    else {
        playSong(sfx, messageChannel, args[0], voiceChannel);
    }

});

function updateTag(oldTag, newTag, messageChannel){
    Database.dbRead(oldTag, (tagName) => {
        if(tagName === null) {
            return messageChannel.send("Audio file not found.");
        }
        else {
            Database.dbChangeTag(oldTag, newTag);
        }
    });
}

async function playSong(sfx, messageChannel, sfxName, voiceChannel) {
    const sfxQuery = await Database.findOne({where:{[Op.or]: [{fileName: sfxName}, {tags: sfx}]} });
    if(sfxQuery) {
        const sfxFile = sfxQuery.get('fileName');
        isReady = false;
        //attempt to connect to voice channel
        voiceChannel.join().then(connection =>
        {
            const dispatcher = connection.play(`${path}${sfxFile}`);
            dispatcher.on("finish", end => {
                voiceChannel.leave();
                });
            }).catch(err => console.log(err));
        isReady = true;
    }
    else {
        return messageChannel.send(`Song ${sfxName} not found.`);
    }
}

// Log in the bot with the token
client.login(token);