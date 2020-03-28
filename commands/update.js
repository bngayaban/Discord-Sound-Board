const Database = require("../dbObjects.js");

async function updateTag(message, args){
    const oldTag = args[0];
    const newTag = args[1];
    const changedRows = await Database.update({ tags: newTag}, {where: { tags: oldTag}});

    if(changedRows > 0) {
        return message.channel.send(`Tag ${oldTag} was updated to ${newTag}`);
    }
    
    return message.channel.send(`Tag ${oldTag} not found.`);
}

module.exports = {
    name: 'update',
    description: 'Update tag to a new tag.',
    args: true,
    numArgs: 2,
    usage: '<old tag> <new tag>',
    execute(message, args) {
        return updateTag(message, args);
    },
}