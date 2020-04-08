module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audioDirectory', {
        filePath: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: false,
    });
};