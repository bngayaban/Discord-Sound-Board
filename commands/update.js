const Database = require("../dbObjects.js");

async function updateTag(message, args){
    let oldTag = args[0];
    let newTag = args[1];
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
        if(args.length != 2) {
            return message.channel.send("Update requires 2 arguments.");
        }
        else return updateTag(message, args);
    },
}