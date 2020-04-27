module.exports = (sequelize, DataTypes) => {
    return sequelize.define('permissions', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    }, {
        timestamps:false,
    });
};