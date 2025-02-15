require('dotenv').config(); 

const express = require('express'); 
const path = require('path'); 
const cors = require('cors'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const emailValidator = require('deep-email-validator'); 
const sqlite3 = require('sqlite3'); 
const sqlite = require('aa-sqlite'); 


const app = express(); 


app.use(cors()); 
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(express.json()); 

let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE, (err) => {
  if(err){
    return console.log(err.message); 
  }
  console.log("Connection Successful");

}); 

sqlite.open('./users.db');


const initializePassport = require('./passport-config')
initializePassport(passport, userByEmail, userById); 


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


async function userById(id){
  try{
      let sqlab = `SELECT * FROM users WHERE id LIKE '${id}'`; 
      let rows = await sqlite.all(sqlab);
      //console.log(rows[0]); 
      return rows[0];  
  }catch(err){
      console.log(err); 
  }
}




//const users = []

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const PORT = process.env.PORT || 5555; 

app.use('/public', express.static(__dirname + '/public'));




app.post('/auth/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/auth/successLogin',
    failureRedirect: '/auth/failLogin'
  })); 

app.get('/auth/successLogin', (req, res) => {
    res.json({
        "status": 0, 
        "message": "Successful Login"
    }); 
}); 

app.get('/auth/failLogin', (req, res) => {
    res.json({
        "status": 1, 
        "message": "Login Failed"
    }); 
}); 

app.post('/auth/register', checkNotAuthenticated, async (req, res) => {
    if(!registrationValidator(req.body.email)){
      return res.json({
        "status": 1,
        "message": "Invalid Email"
      }); 
    }
    else{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // users.push({
        //   id: Date.now().toString(),
        //   email: req.body.email,
        //   password: hashedPassword
        // })
        // console.log(users); 

       // res.redirect('/login')

       let insertUser = `INSERT INTO users(email, password) VALUES (?,?)`; 

       db.run(insertUser, [req.body.email, hashedPassword], (err) =>{
          if(err){
            return console.log(err.message); 
          }

       }); 

       res.json("http://localhost:5555/login"); 
      } catch {
        res.redirect('/register')
      }
    }
}); 


app.post('/logout', checkAuthenticated, function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.json({
        "status": 0,
        "message": "worked"
      }); 
    });
  });


app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.sendFile(path.join(__dirname, './public/html/logged.html'));         
    }
    else{
    res.sendFile(path.join(__dirname, './public/html/index.html')); 
    }
}); 




app.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './public/html/login.html')); 
}); 

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './public/html/register.html')); 
}); 




function registrationValidator(email){
    //check if sas email 
    if(email.split('@')[1] !== 'sas.edu.sg'){
        return false; 
    }
    return isEmailValid(email); 
}

async function isEmailValid(email){
  return emailValidator.validate(email); 
}


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

app.listen(PORT, () =>{
    console.log(`Listening on http://localhost:${PORT}`); 
}); 



