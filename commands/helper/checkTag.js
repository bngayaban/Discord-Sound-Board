const {Audio} = require('../../dbObjects.js');

async function checkTagArgs(nickname, tag){
    if(!/^\w+$/.test(tag)) {
        return Promise.reject(Error(`Invalid tag. Tag can only contain alpha numeric characters and underscores.`));
    }

    const dbAudio = await Audio.findOne({
        where: {
            nickname: nickname,
        }
    });

    console.log(dbAudio)
    if(!dbAudio) {
        return Promise.reject(Error(`Name ${nickname} doesn't exist.`));
    }

    return Promise.resolve(dbAudio);
}

module.exports = {checkTagArgs: checkTagArgs};