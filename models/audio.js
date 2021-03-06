module.exports = (sequelize, DataTypes) => {
    const Audio = sequelize.define('audio', {
        fileName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        nickname: DataTypes.STRING,
        uid: { 
            type: DataTypes.STRING
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        timestamps:false,
    });

    Audio.getAudioByNickname = async (name) => {
        let dbAudio;
        try {
            dbAudio = await Audio.findAll({
                where: {
                    nickname: name
                }
            });
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }

        if(!dbAudio) {
            return Promise.reject(Error(`Name ${name} doesn't exist.`));
        }

        return Promise.resolve(dbAudio);
    }

    return Audio;
};