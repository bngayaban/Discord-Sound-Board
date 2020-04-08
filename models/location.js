module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio_location', {
        file_location: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: false,
    });
};