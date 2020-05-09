const {Tag} = require('../dbObjects.js');
const {checkTagArgs} = require('./helper/checkTag.js');

async function addTag(message, args) {
    const [nickname, tag] = args;
    
    let dbAudio;
    try {
        dbAudio = await checkTagArgs(nickname, tag);
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