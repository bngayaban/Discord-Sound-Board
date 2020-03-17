module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio', {
        fileName: {
            type: DataTypes.STRING,
            unqiue: true,
        },
        tags: DataTypes.STRING,
    })
};