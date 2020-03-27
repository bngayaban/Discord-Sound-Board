const Database = require("../dbObjects.js");

async function listSongs(message, args) {
    const songs = await Database.findAll({attributes: ['tags']});
    const songList = songs.map(s => s.tags).join(', ') || "No songs.";

    return message.channel.send(`List of songs: ${songList}`);
}

module.exports = {
    name: 'list',
    description: 'Lists available sounds.',
    execute(message, args) {
        return listSongs(message, args);
    },
}