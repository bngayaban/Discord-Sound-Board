const Server = require('../Classes/server.js');

async function stop(message, args) {
    const server = Server.getServer(message.guild.id);

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
    execute(message, args) {
        return stop(message, args);
    },
}