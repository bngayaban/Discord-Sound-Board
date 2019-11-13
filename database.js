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
    let sql = "INSERT OR IGNORE INTO  audio (fileName, tags) " + 
              "VALUES (?, ?)";
    if(err) {
        console.error(err.message);
    }
    else {
        const files = fs.readdirSync(folder);
        const filesNoExt = files.map((file) => {return file.split('.').slice(0, -1).join('.')}); //https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

        const statement = db.prepare(sql); // https://stackoverflow.com/a/57839315

        for(let i = 0; i < files.length; i++) {
            statement.run([].concat(files[i], filesNoExt[i]), (err) => {
                if (err) {
                    console.error(err.message);
                }            
            });
        }

        statement.finalize();
    }

}

function dbRead(fileName) {
    const sql = `SELECT fileName name FROM audio WHERE fileName = (?) OR tags = (?) LIMIT 1`;

    db.get(sql, [fileName, fileName], (err, row) => {
        if(err) {
            console.error(err.message);
        }
        return row ? row.name : -1;
    });
}

dbInitialize();