const {User} = require('../dbObjects.js');
const checker = require('./helper/checkArgs.js');

async function modifyPermission(message, args) {
    let user, permission;

    try {
        [user, permission] = await checker.checkArguments(message, args);
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

module.exports = {
    name: 'grant',
    description: `Gives user permissions to use bot. Requires user to already have permission or be an admin. \n
                    Available Permissions:
                    modify - change permission 
                    add - add song 
                    play - play song`,
    args: true,
    numArgs: 2,
    usage: '<username> <permission>',
    execute(message, args) {
        return modifyPermission(message, args);
    },
}