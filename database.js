const sqlite3 = require('sqlite3').verbose();
const folder = './Audio/';
const fs = require('fs');

function dbInit()
{
    let db = new sqlite3.Database('./Database/audio.db', (err) => {
        if(err){
            console.error(err.message);
        }
        else{
            try {
                db.run ('CREATE TABLE IF NOT EXISTS audio(fileName TEXT, tags TEXT)', (err) =>{
                    if(err){
                        console.error(err.message);
                    }
                    else{
                        db.run("BEGIN TRANSACTION");
                        fs.readdirSync(folder).forEach(file => {
                            console.log(file);
                            db.run('INSERT INTO audio(fileName) VALUES ' + file, (err) => {
                                if(err){
                                    console.error(JSON.stringify(err));
                                    return;
                                }
                            });
                            })
                        db.run("END");
                    }
                })
            
            }
            catch(e)
            {
                console.error(e);
            }
            
        }
        console.log('Connected to the audio database.');
    });

    
        


    

    db.close();
}
dbInit();