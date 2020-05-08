const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Database/database.sqlite'
});

const Audio = sequelize.import('models/audio');
const FileLocation = sequelize.import('models/location.js');
const User = sequelize.import('models/user.js');
const Permission = sequelize.import('models/permissions.js');
const Tag = sequelize.import('models/tag.js');

User.belongsToMany(Permission, {as: 'Permission', through: 'Rules'});
Permission.belongsToMany(User, {as: 'Permission', through: 'Rules'});
Audio.FileLocation = Audio.belongsTo(FileLocation);
Audio.belongsToMany(Tag, {through: 'AudioTag'});
Tag.belongsToMany(Audio, {through: 'AudioTag'});


module.exports = {Audio, FileLocation, User, Permission, Tag};