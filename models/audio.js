module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio', {
        fileName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        tags: DataTypes.STRING,
    }, {
        timestamps:false,
    });
};