async function skip(message, args, servers) {
    if(!servers[message.guild.id])
        return message.reply("Try playing a song first.");

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