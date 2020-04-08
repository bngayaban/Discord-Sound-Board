module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio', {
        fileName: {
            type: DataTypes.STRING,
            unique: true,
        },
        tags: DataTypes.STRING,
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps:false,
    });
};