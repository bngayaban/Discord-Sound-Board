const {Audio, Tag} = require('../dbObjects.js');

async function addTag(message, args) {
    const [nickname, tag] = args;
    
    let dbAudio;
    try {
        dbAudio = await checkArgs(nickname, tag);
    } catch (e) {
        console.log(`${e}`);
        return message.channel.send(`${e}`);
    }
    
    const [dbTag, created ] = await Tag.findOrCreate({
        where: {
            tagName: tag,
        }
    });

    await dbTag.addAudio(dbAudio);

    return message.channel.send(`Added tag ${tag} to ${nickname}`);
}

async function checkArgs(nickname, tag){
    if(!/^\w+$/.test(tag)) {
        return Promise.reject(Error(`Invalid tag. Tag can only contain alpha numeric characters and underscores.`));
    }

    const dbAudio = await Audio.findOne({
        where: {
            nickname: nickname,
        }
    });

    console.log(dbAudio)
    if(!dbAudio) {
        return Promise.reject(Error(`Name ${nickname} doesn't exist.`));
    }

    return Promise.resolve(dbAudio);
}

module.exports = {
    name: 'addtag',
    description: 'Add tag to sound file.',
    usage: '<prefix><command name> <file nickname> <tag>',
    numArgs: 2,
    args: true,
    execute(message, args) {
        return addTag(message, args);
    },
};