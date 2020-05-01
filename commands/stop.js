async function stop(message, args, servers) {
    if(!servers[message.guild.id])
        return message.reply("Try playing a song first.");

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