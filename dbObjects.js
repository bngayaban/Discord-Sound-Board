const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Database/database.sqlite'
});

const Audio = sequelize.import('models/audio');
const FileLocation = sequelize.import('models/location.js');

Audio.FileLocation = Audio.belongsTo(FileLocation);

module.exports = {Audio, FileLocation};