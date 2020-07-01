const {syncDatabase} = require('./Setup/databaseInit');
const {normalize} = require('./Setup/normalizeRunner');

(async () => {
    console.log('Normalizing files.');
    await normalize();
    console.log('Synchronizing database.')
    await syncDatabase();
    console.log('Sound Board Bot ready to start.');
})(); 