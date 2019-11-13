const sqlite3 = require('sqlite3').verbose();
const folder = './Audio/';
const fs = require('fs');

const db = new sqlite3.Database('./Database/audio.db', (err) => {
    if(err){
        console.error(err.message);
    }
});


function dbInitialize(){
    const sql = "CREATE TABLE IF NOT EXISTS audio(fileName TEXT, tags TEXT, UNIQUE(fileName))";

    db.run(sql, dbPopulate);
}

function dbPopulate(err){
    let sql = "INSERT OR IGNORE INTO audio (fileName) VALUES ";
    if(err) {
        console.error(err.message);
    }
    else {
        const files = fs.readdirSync(folder);
        const placeholders = files.map((file) => '(?)').join(',');
        
        sql += placeholders;
        db.run(sql, files, (err) => {
            if(err) {
                return console.error(err.message);
            }
            console.log(`Rows inserted ${this.changes}`);
        });
    }

}

function dbRead(fileName) {
    const sql = `SELECT fileName FROM audio WHERE fileName = (?) OR tags = (?) LIMIT 1`;

    db.get(sql, [fileName, fileName], (err) => {
        if(err) {
            return console.error(err.message);
        }
        console.log(`Rows inserted ${this.changes}`);
    });
}

dbInitialize();