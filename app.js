// Require discord.js package
const Discord = require("discord.js");

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

// When the bot is reconnecting to the websocket
client.on("reconnecting", () =>{
    console.log(`This bot is reconnecting: ${client.user.tag}`);
});

// When the bot disconnects from the websocket
client.on("disconnect", () =>{
    console.log(`This bot is now disconnected: ${client.user.tag}`);
});

var isReady = true;

// !help command, message event + message object
client.on("message", msg => {
    const soundBoardPrefix = "!sb"
    const voiceChannel = msg.member.voiceChannel;
    const sfx = ["overconfidence.mp3", "triple.mp3", "dio.mp3", "StillAlive.mp3"];
    if(!isReady) return;

    if(!msg.content.startsWith(soundBoardPrefix) || msg.author.bot) return;

    if(!voiceChannel)
    {
        return msg.reply('you need to be in a voice channel to use.');
    }

    const args = msg.content.slice(soundBoardPrefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(args.length != 1)
    {
        return msg.channel.send("This command requires one arguement.");
    }

    let index = sfx.findIndex(element => element.includes(args[0]));
    if(index == -1)
    {
        return msg.channel.send(`Song ${args[0]} not found.`);
    }

    isReady = false;
    //attempt to connect to voice channel
    voiceChannel.join().then(connection =>
        {

            const dispatcher = connection.playFile(`./Audio/${sfx[index]}`);
            dispatcher.on("end", end => {
                voiceChannel.leave();
                });
            }).catch(err => console.log(err));
    isReady = true;
});



// Log in the bot with the token
client.login(token);