const Server = require('../Classes/server.js');

async function pause(message, args) {
    const server = Server.getServer(message.guild.id);

    if(server.dispatcher) {
        server.dispatcher.resume()
    }
}

module.exports = {
    name: 'resume',
    description: 'Resumes the player',
    voice: true,
    execute(message, args) {
        return pause(message, args);
    },
}