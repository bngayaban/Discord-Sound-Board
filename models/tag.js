module.exports = (sequelize, DataTypes) => {
    const tagRegex = /^[a-z0-9_]+$/; //strings contain a combination of lowercase letters, numbers or underscores

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