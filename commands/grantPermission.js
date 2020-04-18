const {User, Permission} = require('../dbObjects.js');

async function modifyPermission(message, args) {
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
                permission: 'modify',
            }
        }],
    });

    //check if server admin, owner, or has modify permissions
    if(!(message.member.hasPermission('ADMINISTRATOR', {checkOwner: true, checkAdmin: true})
        || check)) {
        return message.channel.send('You do not have enough privilege to use');
    }

    // check if username is valid by finding it
    const user = message.guild.members.cache.find(m => m.displayName === username);
    if(!user)
        return message.channel.send(`Could not find ${username}.\nPlease check spelling and try again.`);

    //check database if permission being modified exists
    const perm = await Permission.findOne({where:{permission: permission}});
    if(!perm)
        return message.channel.send(`Could not find ${permission} permission.\nPlease check spelling and try again.`);

    const [newUser, _ ] = await User.findOrCreate({
        where: {
            uid: user.id,
            gid: message.guild.id,
        }
    });
    //console.log(newUser)

    newUser.addPermission(perm);
}

async function checkArguements() {

}
module.exports = {
    name: 'grantpermission',
    description: 'Gives user permissions to use bot. Requires user to already have permission or be an admin',
    args: true,
    numArgs: 2,
    usage: '<username> <permission>',
    execute(message, args) {
        return modifyPermission(message, args);
    },
}