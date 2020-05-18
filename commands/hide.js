const {Audio} = require('../dbObjects.js');

async function hide(message, args) {
    const nickname = args;

    let nUpdated;
    try {
        [nUpdated, _ ] = await Audio.update(
            {hidden: true},
            {where: {
                nickname: nickname
            }}
        );
    } catch (e) {
        console.log(e);
    }

    if(!(nUpdated === 1)) {
        return message.channel.send(`Could not hide ${nickname}.`);
    }

    return message.channel.send(`Hid ${nickname}.`);
}

module.exports = {
    name: 'hide',
    description: 'Hides a sound.',
    usage: '<nickname>',
    execute(message, args) {
        return hide(message, args);
    },
};