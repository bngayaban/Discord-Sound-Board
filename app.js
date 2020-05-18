// Require discord.js package
const Discord = require("discord.js");
const fs = require('fs');
const assist = require('./helper/permissionCheck');

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

// !help command, message event + message object
client.on("message", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(message.content);

    // removes prefix then splits by white space or quotes, then replaces quotes with nothing
    // https://stackoverflow.com/a/366229
    const args = message.content.slice(prefix.length).match(/('.*?'|".*?"|\S+)/g).map(str => str.replace(/(\"|\')/g, ''));
    console.log(args);
    
    let commandName = args.shift().toLowerCase();
    console.log(args);

    if(!commandName) {
        commandName = 'help';
    }

    // If no command try playing it
    if(!client.commands.has(commandName)) {
        if(message.member.voice.channel) {
            return client.commands.get('play').execute(message, commandName);
        } else {
            return message.reply('you need to be in a voice channel to use.');
        }
    }
        
    const command = client.commands.get(commandName);

    if (('requiredArgs' in command) &&
        !(command.requiredArgs == args.length) && 
        !(command.requiredArgs < args.length && command.optionalArgs === true)) {
        let reply = `Command requires `;

        if(command.optionalArgs) {
            reply += 'at least ';
        }

        reply += `${command.requiredArgs} arguments.`

        if (command.usage) {
            reply += `\nProper usage would be: ${prefix} ${command.name} ${command.usage}`;
        }
        return message.channel.send(reply);
    }

    if(command.voice && !message.member.voice.channel) {
        return message.reply('You need to be in a voice channel to use.');
    }

    if(command.permission) {
        let hasPermission;
        try {
            hasPermission = await assist.checkPermission(message, command.permission);
        } catch (error) {
            return message.reply(`${error}`);
        }

        if(!hasPermission) {
            return message.reply('You do not have enough privilege to use.');
        }
    }

    try {
        command.execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('There was an error trying to execute that command.');
    }

});

// Log in the bot with the token
client.login(token);