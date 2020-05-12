const Server = require('../Classes/server.js');

async function stop(message, args, servers) {
    if(!servers[message.guild.id]) {
        servers[message.guild.id] = new Server(message.guild.id);
    }
    const server = servers[message.guild.id];

    if(server.dispatcher) {
        server.queue = [];
        server.nowPlaying = "";
        server.dispatcher.end();
    }
}

module.exports = {
    name: 'clear',
    description: 'Clears the current song and the queue.',
    voice: true,
    execute(message, args, servers) {
        return stop(message, args, servers);
    },
}