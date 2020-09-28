const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Database/database.sqlite'
});

const Audio = require('./models/audio')(sequelize, Sequelize.DataTypes);
const FileLocation = require('./models/location.js')(sequelize, Sequelize.DataTypes);
const User = require('./models/user.js')(sequelize, Sequelize.DataTypes);
const Permission = require('./models/permissions.js')(sequelize, Sequelize.DataTypes);
const Tag = require('./models/tag.js')(sequelize, Sequelize.DataTypes);

User.belongsToMany(Permission, {as: 'Permission', through: 'Rules'});
Permission.belongsToMany(User, {as: 'Permission', through: 'Rules'});
Audio.belongsTo(FileLocation);
Audio.belongsToMany(Tag, {through: 'AudioTag'});
Tag.belongsToMany(Audio, {through: 'AudioTag'});


module.exports = {Audio, FileLocation, User, Permission, Tag};