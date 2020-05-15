const Server = require('../Classes/server.js');

async function skip(message, args) {
    const server = Server.getServer(message.guild.id);

    if(server.dispatcher)
        return server.dispatcher.end();
    else
        return message.channel.send("Queue is empty. No need to skip.");
}

module.exports = {
    name: 'skip',
    description: 'Skip current sound',
    voice: true,
    execute(message, args) {
        return skip(message, args);
    },
}