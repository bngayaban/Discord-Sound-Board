const {Tag, Audio} = require('../dbObjects.js')

async function listTag(message, args) {  
    let tags;
    
    try{
        tags = await findTags();
    } catch (e) {
        return message.channel.send(`${e}`);
    }

    if(!tags) {
        return message.channel.send('No tags');
    }

    let tagList = 'List of tags:\n';
    for(const tag of tags) {
        tagList += `\t${tag.tagName}: `;
        tagList += tag.audios.map(a => a.nickname).join(', ') || 'No Audio';
        tagList += '\n';
    }

    console.log(tagList);

    return message.channel.send(tagList, {split: {char: ', '}});
}

async function findTags() {
    let tags;
    try {
        tags = await Tag.findAll({
            attributes: ['tagName'],
            order: [['tagName', 'ASC'], [Audio, 'nickname', 'ASC']],
            include: {model: Audio, attributes: ['nickname']},
        });
    } catch (e) {
        console.log(`${e}`);
        return Promise.reject(e);
    }

    return Promise.resolve(tags);
}

module.exports = {
    name: 'listtag',
    description: 'Lists all tags and their associated sounds',
    usage: '<tag>',
    execute(message, args) {
        return listTag(message, args);
    },
};