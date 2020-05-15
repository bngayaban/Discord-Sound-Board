const Server = require('../Classes/server.js');

async function pause(message, args) {
    const server = Server.getServer(message.guild.id);

    if(server.dispatcher) {
        server.dispatcher.pause()
    }
}

module.exports = {
    name: 'pause',
    description: 'Pauses the player',
    voice: true,
    execute(message, args) {
        return pause(message, args);
    },
}