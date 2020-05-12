const Server = require('../Classes/server.js');

async function skip(message, args, servers) {
    if(!servers[message.guild.id]) {
        servers[message.guild.id] = new Server(message.guild.id);
    }
    
    const server = servers[message.guild.id];

    if(server.dispatcher)
        return server.dispatcher.end();
    else
        return message.channel.send("Queue is empty. No need to skip.");
}

module.exports = {
    name: 'skip',
    description: 'Skip current sound',
    voice: true,
    execute(message, args, servers) {
        return skip(message, args, servers);
    },
}