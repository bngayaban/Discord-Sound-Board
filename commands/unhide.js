const {Audio} = require('../dbObjects.js');

async function hide(message, args) {
    const nickname = args;

    let nUpdated;
    try {
        [nUpdated, _ ] = await Audio.update(
            {hidden: false},
            {where: {
                nickname: nickname
            }}
        );
    } catch (e) {
        console.log(e);
    }

    if(!(nUpdated === 1)) {
        return message.channel.send(`Could not unhide ${nickname}.`);
    }

    return message.channel.send(`Unhid ${nickname}.`);
}

module.exports = {
    name: 'unhide',
    description: 'Unhides a sound.',
    usage: '<nickname>',
    execute(message, args) {
        return hide(message, args);
    },
};