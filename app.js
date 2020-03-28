// Require discord.js package
const Discord = require("discord.js");
const Database = require("./dbObjects.js");
const fs = require('fs');

// Create a new client using the new keyword
const client = new Discord.Client();
client.commands = new Discord.Collection();

//setup dynamic commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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

let servers = {};

// !help command, message event + message object
client.on("message", message => {
    const soundBoardPrefix = "!sb";

    if(!message.content.startsWith(soundBoardPrefix) || message.author.bot) return;

    if(!message.member.voice.channel)
    {
        return message.reply('you need to be in a voice channel to use.');
    }
    console.log(message.content);
    const args = message.content.slice(soundBoardPrefix.length).split(" ").filter(x => x).map((item)=>{return item.toLowerCase()}); //removes the soundboard prefix and seperates by spaces and lowercases
    console.log(args);

    let commandName = args.shift();
    console.log(args);
    if(!client.commands.has(commandName)) 
        return client.commands.get('play').execute(message, commandName, servers);

    try {
        client.commands.get(commandName).execute(message, args, servers);
    } catch(error) {
        console.error(error);
        message.reply('There was an error trying to execute that command');
    }

});

// Log in the bot with the token
client.login(token);