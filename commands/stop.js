async function stop(message, args) {
    if(dispatcher) {
        queue = [];
        nowPlaying = "";
        dispatcher.end();
    }
}

module.exports = {
    name: 'update',
    description: 'Update',
    execute(message, args) {
        return stop(message, args);
    },
}