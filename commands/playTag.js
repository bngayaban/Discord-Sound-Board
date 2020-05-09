const {Audio, Tag} = require('../dbObjects.js');
const {playSong} = require('./play.js');

async function playTag(message, args, servers) {
    const tag = args;

    const dbTag = await Tag.findOne({
        where: {
            tagName: tag,
        }
    })

    if(!dbTag) {
        return message.channel.send(`Tag ${tag} doesn't exist. Check spelling.`);
    }

    const songs = await dbTag.getAudios();
    console.log(songs.length);

    const songNum = getRandomInt(songs.length);

    return playSong(message, songs[songNum].nickname, servers);

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: 'playtag',
    description: 'Play a random sound based on tag',
    usage: '<prefix><command name> <tag>',
    numArgs: 1,
    args: true,
    execute(message, args, servers) {
        return playTag(message, args, servers);
    },
};