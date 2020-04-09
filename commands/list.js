const {Audio} = require("../dbObjects.js");

async function listSongs(message, args) {
    const songs = await Audio.findAll({attributes: ['tags']});
    const songList = songs.map(s => s.tags).join(', ') || "No songs.";
    console.log(songList);
    return message.channel.send(`List of songs: ${songList}`, {split:{char:', '}});
}

module.exports = {
    name: 'list',
    description: 'Lists available sounds.',
    execute(message, args) {
        return listSongs(message, args);
    },
}