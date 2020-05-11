const {Audio, Tag} = require('../dbObjects.js');

async function removeTag(message, args) {
    const tag = args.shift().toLowerCase();
    const nickname = args.map(a => a.toLowerCase()); //one nickname or an array of nicknames
    
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

    const [foundNames, notFoundNames] = filterNames(dbAudio, nickname); 
    if(foundNames.length === 0) {
        return message.channel.send('Could not find any audio. Check spelling.');
    } else if(foundNames.length < nickname.length) {
        message.channel.send(`Could not find ${notFoundNames}. Check spelling and try again.`)
    }
    

    if(!dbTag) {
        return message.channel.send(`Tag ${tag} doesn't exist. Check spelling.`);
    }

    try {
        await dbTag.removeAudio(dbAudio);
    } catch (e) {
        console.log(`${e}`);
        return message.channel.send(`${e}`);
    }
    
    const tagCount = await dbTag.countAudios();
    if(tagCount === 0) {
        await dbTag.destroy();
    }

    return message.channel.send(`Removed tag ${tag} from ${foundNames}.`)
}

function filterNames(dbAudio, nicknames) {
    const foundNames = dbAudio.map(d => d.nickname);
    const notFoundNames = nicknames.filter(n => !foundNames.includes(n));

    return [foundNames, notFoundNames];
}

module.exports = {
    name: 'removetag',
    description: 'Remove tag from sound file.',
    usage: '<tag> <nickname>',
    numArgs: 2,
    args: true,
    execute(message, args) {
        return removeTag(message, args);
    },
};