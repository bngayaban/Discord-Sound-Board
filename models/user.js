module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        uid: {
            type: DataTypes.STRING,
        },
        gid: DataTypes.STRING,
    }, {
        timestamps:false,
    });
};