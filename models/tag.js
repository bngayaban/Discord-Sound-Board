module.exports = (sequelize, DataTypes) => {
    const tagRegex = /^\w+$/i;

    const Tag = sequelize.define('tag', {
        tagName: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                is: {
                    args: tagRegex,
                    msg: 'Tag must be either alphanumeric or underscores.'
                },
            },
        },
    }, {
        timestamps:false,
    });

    return Tag;
};