const { exit } = require('process');
let sqlite3 = require('sqlite3'); 

let db; 

new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err && err.code == "SQLITE_CANTOPEN"){
        createDatabase(); 
        return; 
    }
    else if(err){
        console.log("Getting Error ", err);
        exit(1);
    }
    
}); 


function createDatabase(){
    let newdb = new sqlite3.Database('users.db', (err) => {
        if(err){
            console.log("Getting error ", err); 
            exit(1); 
        }
        createTables(newdb); 
    }); 
}

function createTables(newdb){
    newdb.exec(`
    create table users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email text not null,
        password text not null
    ); `
    ); 
  
}