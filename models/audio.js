module.exports = (sequelize, DataTypes) => {
    return sequelize.define('audio', {
        fileName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        tags: DataTypes.STRING,
        uid: { 
            type: DataTypes.STRING
        },
    }, {
        timestamps:false,
    });
};