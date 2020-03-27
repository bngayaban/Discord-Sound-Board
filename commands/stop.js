async function stop(message, args, servers) {
    if(!servers[message.guild.id])
        return message.reply("Try playing a song first.");

    let server = servers[message.guild.id];

    if(server.dispatcher) {
        server.queue = [];
        server.nowPlaying = "";
        server.dispatcher.end();
    }
}

module.exports = {
    name: 'stop',
    description: 'Stops the player',
    execute(message, args, servers) {
        return stop(message, args, servers);
    },
}