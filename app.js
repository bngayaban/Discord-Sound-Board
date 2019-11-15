// Require discord.js package
const Discord = require("discord.js");
const Database = require("./database.js");
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
    Database.dbInitialize();
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
    const soundBoardPrefix = "!sb"
    const voiceChannel = msg.member.voiceChannel;

    if(!isReady) return;

    if(!msg.content.startsWith(soundBoardPrefix) || msg.author.bot) return;

    if(!voiceChannel)
    {
        return msg.reply('you need to be in a voice channel to use.');
    }
    console.log(msg.content);
    const args = msg.content.slice(soundBoardPrefix.length).split(" ").filter(x => x); //removes the soundboard prefix and seperates by spaces
    console.log(args);
    const sfx = args[0].toLowerCase(); // makes song case insensitive

    if(args.length != 1)
    {
        return msg.channel.send("This command requires one arguement.");
    }

    Database.dbRead(sfx, (sfxFile) => {
        if(sfxFile === null)
        {
            return msg.channel.send(`Song ${args[0]} not found.`);
        }
        else {
            isReady = false;
            //attempt to connect to voice channel
            voiceChannel.join().then(connection =>
            {
    
                const dispatcher = connection.playFile(`${path}${sfxFile}`);
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    });
                }).catch(err => console.log(err));
            isReady = true;
        }   
    });  
});



// Log in the bot with the token
client.login(token);