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

// !help command, message event + message object
client.on("message", msg => {
    const soundBoardPrefix = "!sb"
    const voiceChannel = msg.member.voiceChannel;

    if(!msg.content.startsWith(soundBoardPrefix) || msg.author.bot) return;

    if(!voiceChannel)
    {
        return msg.reply('you need to be in a voice channel to use.');
    }

    const args = msg.content.slice(soundBoardPrefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //attempt to connect to voice channel
    voiceChannel.join().then(connection =>
        {
            const dispatcher = connection.playFile('./Audio/StillAlive.mp3');
            dispatcher.on("end", end => {
                voiceChannel.leave();
                });
            }).catch(err => console.log(err));
});



// Log in the bot with the token
client.login(token);