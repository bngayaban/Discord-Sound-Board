async function pause(message, args, servers) {
    if(!servers[message.guild.id])
        return message.reply("Try playing a song first.");

    let server = servers[message.guild.id];

    if(server.dispatcher) {
        server.dispatcher.pause()
    }
}

module.exports = {
    name: 'pause',
    description: 'Pauses the player',
    voice: true,
    execute(message, args, servers) {
        return pause(message, args, servers);
    },
}