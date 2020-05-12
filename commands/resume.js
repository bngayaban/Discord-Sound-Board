const Server = require('../Classes/server.js');

async function pause(message, args, servers) {
    if(!servers[message.guild.id]) {
        servers[message.guild.id] = new Server(message.guild.id);
    }

    const server = servers[message.guild.id];

    if(server.dispatcher) {
        server.dispatcher.resume()
    }
}

module.exports = {
    name: 'resume',
    description: 'Resumes the player',
    voice: true,
    execute(message, args, servers) {
        return pause(message, args, servers);
    },
}