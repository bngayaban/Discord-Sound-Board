const {User, Permission} = require('../dbObjects.js');

async function modifyPermission(message, args) {
    let user, permission;

    try {
        [user, permission] = await checkArguments(message, args);
    } catch (error) {
        console.log(`${error}`);
        return message.channel.send(`${error}`);
    }
    console.log(user)
    const [newUser, _ ] = await User.findOrCreate({
        where: {
            uid: user.id,
            gid: message.guild.id,
        }
    });
    console.log(permission)

    try {
        await newUser.addPermission(permission);
        return message.channel.send(`${user.user.username} has been granted ${permission.permission} permissions.`)
    } catch (error) {
        console.log(`${error}`);
    }

}

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
                permission: 'modify',
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
    const perm = await Permission.findOne({where:{permission: permission}});
    if(!perm)
        return Promise.reject(Error(`Could not find ${permission} permission.\nPlease check spelling and try again.`));

    return Promise.resolve([user, perm]);
}
module.exports = {
    name: 'grant',
    description: `Gives user permissions to use bot. Requires user to already have permission or be an admin. \n
                    Available Permissions: \n
                    modify - change permission \n 
                    add - add song \n 
                    play - play song`,
    args: true,
    numArgs: 2,
    usage: '<username> <permission>',
    execute(message, args) {
        return modifyPermission(message, args);
    },
}