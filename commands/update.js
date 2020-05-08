const {Audio} = require("../dbObjects.js");

async function updateName(message, args) {
    const [oldName, newName] = args;

    const fileName = await nicknameExists(newName);
    if(fileName) {
        return message.channel.send(`${newName} already exists for ${fileName}. \nEither use a different name or rename  ${fileName}.`)
    }

    const changedRows = await Audio.update({ nickname: newName}, {where: { nickname: oldName}});

    if(changedRows > 0) {
        return message.channel.send(`Name ${oldName} was renamed to ${newName}`);
    }
    
    return message.channel.send(`Name ${oldName} not found.`);
}

async function nicknameExists(name) {
    const query = await Audio.findOne({
        where: {
            nickname: name,
        }
    });

    return query ? query.fileName : query;
}

module.exports = {
    name: 'rename',
    description: 'Rename Name to a new Name.',
    args: true,
    numArgs: 2,
    usage: '<old Name> <new Name>',
    execute(message, args) {
        return updateName(message, args);
    },
}