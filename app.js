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
    token,
    prefix
} = require("./config.js");

// Display a message once the bot has started
client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once('ready', () => {
    //Database.sync();
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
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(message.content);
    const args = message.content.slice(prefix.length).match(/\S+/g);//.filter(x => x).map((item)=>{return item.toLowerCase()}); //removes the soundboard prefix and seperates by spaces and lowercases
    console.log(args);

    let commandName = args.shift().toLowerCase();
    console.log(args);

    if(!commandName) {
        commandName = 'help';
    }

    // If no command try playing it
    if(!client.commands.has(commandName)) {
        if(message.member.voice.channel) {
            return client.commands.get('play').execute(message, commandName, servers);
        } else {
            return message.reply('you need to be in a voice channel to use.');
        }
    }
        
    const command = client.commands.get(commandName);

    if (command.args && command.numArgs != args.length) {
        let reply = `Command requires ${command.numArgs} arguments.`;

        if (command.usage) {
            reply += `\n Proper usage would be: ${prefix} ${command.name} ${command.usage}`;
        }
        return message.channel.send(reply);
    }

    if(command.voice && !message.member.voice.channel) {
        return message.reply('You need to be in a voice channel to use.');
    }

    try {
        command.execute(message, args, servers);
    } catch(error) {
        console.error(error);
        message.reply('There was an error trying to execute that command.');
    }
});

// Log in the bot with the token
client.login(token);