const {User, Permission} = require('../dbObjects.js');
const checker = require('./helper/checkArgs.js');

async function modifyPermission(message, args) {
    let user, permission;

    // check args
    try {
        [user, permission] = await checker.checkArguments(message, args);
    } catch (error) {
        console.log(`${error}`);
        return message.channel.send(`${error}`);
    }
    
    // grab user from db
    const query = await User.findOne({
        where: {
            uid: user.id,
            gid: message.guild.id,
        }
    })

    // if user does not exist in db, then they have no permissions
    if(!query) {
        return message.channel.send(`${user.user.username} does not have any permissions.`);
    }

    // check if user has the permission
    const hasP = await query.hasPermission(permission);
    if(!hasP) {
        return message.channel.send(`${user.user.username} does not have ${permission.name} permissions.`)
    }

    // then remove it
    await query.removePermission(permission);
    
    // if they have no more permissions, then remove them from db
    const pCount = await query.countPermission();
    if(pCount == 0) {
        await query.destroy()
    }

    return message.channel.send(`Revoked ${permission.name} permissions for ${user.user.username}.`);
}

module.exports = {
    name: 'revoke',
    description: `Revokes user permissions to use bot. Requires user to already have permission or be an admin. \n
                    Available Permissions:
                    modify - change permission 
                    add - add song 
                    play - play song`,
    args: true,
    numArgs: 2,
    usage: '<username> <permission>',
    permission: 'modify',
    execute(message, args) {
        return modifyPermission(message, args);
    },
}