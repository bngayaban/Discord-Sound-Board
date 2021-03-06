const {Audio, Tag} = require('../dbObjects.js');
const DirectoryUtility = require('../Classes/directoryUtility.js');

async function addTag(message, args) {
    const tag = args.shift().toLowerCase();
    const nickname = DirectoryUtility.toNickname(args);//one nickname or an array of nicknames

    let dbAudio;
    let tagNickname;

    try {
        dbAudio = await Audio.getAudioByNickname(nickname);
        tagNickname = await Audio.getAudioByNickname(tag);
    } catch(e) {
        console.log(`${e}`);
        return message.channel.send(`${e}`);
    }
    
    const [foundNames, notFoundNames] = filterNames(dbAudio, nickname); 
    if(foundNames.length === 0) {
        return message.channel.send('Could not find any audio. Check spelling.');
    } else if(foundNames.length < nickname.length) {
        message.channel.send(`Could not find ${notFoundNames}. Check spelling and try again.`)
    }
    
    if(tagNickname.length > 0) {
        return message.channel.send(`Tag ${tag} can't be used as it is already being used as a nickname for ${tagNickname[0].fileName}.`)
    }

    try {
        const [dbTag, created ] = await Tag.findOrCreate({
            where: {
                tagName: tag,
            }
        });

        await dbTag.addAudio(dbAudio);
    } catch (e) {
        if(e.name === 'SequelizeValidationError') {
            console.log(e);
            return message.channel.send(`Error: Tag ${tag} can only contain letters, numbers or underscores.`);
        }
        return console.log(e);
    }

    return message.channel.send(`Added tag ${tag} to ${foundNames}`);
}

function filterNames(dbAudio, nicknames) {
    const foundNames = dbAudio.map(d => d.nickname);
    const notFoundNames = nicknames.filter(n => !foundNames.includes(n));

    return [foundNames, notFoundNames];
}



module.exports = {
    name: 'addtag',
    description: 'Add tag to sound file.',
    usage: '<tag> <sound nickname> [0 or more additional nicknames]',
    requiredArgs: 2,
    optionalArgs: true,
    execute(message, args) {
        return addTag(message, args);
    },
};