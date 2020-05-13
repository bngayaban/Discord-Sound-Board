module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio', {
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
};