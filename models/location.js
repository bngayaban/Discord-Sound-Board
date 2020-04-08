module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio_location', {
        location_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        file_location: {
            type: DataTypes.String,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};