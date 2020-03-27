async function updateTag(message, args){
    let oldTag = args[1];
    let newTag = args[2];
    const changedRows = await Database.update({ tags: newTag}, {where: { tags: oldTag}});

    if(changedRows > 0) {
        return message.channel.send(`Tag ${oldTag} was updated to ${newTag}`);
    }
        return message.channel.send(`Tag ${oldTag} not found.`);
}

module.exports = {
    name: 'update',
    description: 'Update',
    execute(message, args) {
        if(args.length != 3) {
            return message.channel.send("Update requires 3 arguments.");
        }
        else return updateTag(message, args);
    },
}