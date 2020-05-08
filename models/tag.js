module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        tagName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    }, {
        timestamps:false,
    });
};