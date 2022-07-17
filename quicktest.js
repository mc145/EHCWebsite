let sqlite3 = require('sqlite3'); 
let sqlite = require('aa-sqlite'); 

// let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
//     if(err){
//       return console.log(err.message); 
//     }
//     console.log("Connection Successful");
  
//   }); 

sqlite.open('./users.db');

//   let email = 'blablabla'; 

//   function userByEmail(email){

// let sql = `SELECT * FROM users WHERE email LIKE '${email}'`; 
 

//   db.all(sql, [], (err, rows) =>{
//     if(err) return console.log(err.message); 

    
// }); 

    
// }



async function userByEmail(email){
    try{
        let sqla = `SELECT * FROM users WHERE email LIKE '${email}'`; 
        let rows = await sqlite.all(sqla);
        //console.log(rows[0]); 
        return rows[0];  
    }catch(err){
        console.log(err); 
    }
}

async function main(){


const rows = await userByEmail("agarwal45366@sas.edu.sg"); 

console.log(rows); 

}

main(); 


// function userByEmail(email){
//     let sqlTest = `SELECT * FROM users WHERE email LIKE '${email}'`; 
  
//     db.all(sqlTest, [], (err, rows) =>{
//       if(err) return console.log(err.message); 
  
//       return rows; 
//     });
//   }


//   console.log(userByEmail('agarwal45366@sas.edu.sg')); 