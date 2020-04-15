module.exports = (sequelize, DataTypes) => {
    return sequelize.define('permissions', {
        permission: {
            type: DataTypes.STRING,
            unique: true,
        },
    }, {
        timestamps:false,
    });
};