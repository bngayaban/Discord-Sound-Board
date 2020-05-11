const {Audio, Tag} = require('../dbObjects.js');

async function removeTag(message, args) {
    const [nickname, tag] = args;
    
    let dbAudio;
    try {
        dbAudio = await Audio.getAudioByNickname(nickname);
    } catch(e) {
        console.log(`${e}`);
        return message.channel.send(`${e}`);
    }

    const dbTag = await Tag.findOne({
        where: {
            tagName: tag,
        }
    })

    if(!dbTag) {
        return message.channel.send(`Tag ${tag} doesn't exist. Check spelling.`);
    }

    try {
        await dbAudio.removeTag(dbTag);
    } catch (e) {
        console.log(`${e}`);
        return message.channel.send(`${e}`);
    }
    
    const tagCount = await dbTag.countAudios();
    if(tagCount === 0) {
        await dbTag.destroy();
    }

    return message.channel.send(`Removed tag ${tag} from ${nickname}.`)
}

module.exports = {
    name: 'removetag',
    description: 'Remove tag from sound file.',
    usage: '<file nickname> <tag>',
    numArgs: 2,
    args: true,
    execute(message, args) {
        return removeTag(message, args);
    },
};