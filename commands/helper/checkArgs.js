const {User, Permission} = require('../../dbObjects.js');

async function checkArguments(message, args) {
    const [username, permission] = args;

    // check if username is valid by finding it
    const user = message.guild.members.cache.find(m => m.user.username === username);
    if(!user)
        return Promise.reject(Error(`Could not find ${username}.\nPlease check spelling and try again.`));

    //check database if permission being modified exists
    const perm = await Permission.findOne({where:{name: permission}});
    if(!perm)
        return Promise.reject(Error(`Could not find ${permission} permission.\nPlease check spelling and try again.`));

    return Promise.resolve([user, perm]);
}

module.exports = {
    checkArguments
}