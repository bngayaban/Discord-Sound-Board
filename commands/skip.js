async function skip(message, args) {
    if(dispatcher)
        return dispatcher.end();
    else
        return message.channel.send("Queue is empty. No need to skip.");
}

module.exports = {
    name: 'skip',
    description: 'SKip current sound',
    execute(message, args) {
        return skip(message, args);
    },
}