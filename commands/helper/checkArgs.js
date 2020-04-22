const {User, Permission} = require('../../dbObjects.js');

async function checkArguments(message, args) {
    const [username, permission] = args;

    // get user's modify permissions
    const check = await User.findOne({
        where: {
            uid: message.member.id,
            gid: message.guild.id,
        },
        include: [{
            model: Permission,
            as: 'Permission',
            where: {
                name: 'modify',
            }
        }],
    });

    //check if server admin, owner, or has modify permissions
    if(!(message.member.hasPermission('ADMINISTRATOR', {checkOwner: true, checkAdmin: true})
        || check)) {
        return Promise.reject(Error('You do not have enough privilege to use'));
    }

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