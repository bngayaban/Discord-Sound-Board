const {User, Permission} = require('../dbObjects.js');

async function checkPermission(message, args) {
    const p = args[0];
    let check;

    // do i check if the permission is valid? No, because this is internal and we should assume we write it correctly.. hopefully
    try {
        check = await User.findOne({
            where: {
                uid: message.member.id,
                gid: message.guild.id,
            },
            include: [{
                model: Permission,
                as: 'Permission',
                where: {
                    name: p,
                }
            }],
        });
    } catch(error) {
        console.log(error);
        return Promise.reject(error);
    }
    

    //check if server admin, owner, or has modify permissions
    if(!(message.member.hasPermission('ADMINISTRATOR', {checkOwner: true, checkAdmin: true})
        || check)) {
        return Promise.resolve(false);//Promise.reject(Error('You do not have enough privilege to use'));
    }
    
    return Promise.resolve(true);
}

module.exports = {
    checkPermission
}
