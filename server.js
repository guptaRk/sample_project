const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const withAuth = require('./middleware');

const app = express();
const secret = 'mysecretsshhh';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test"
});
  

con.connect(function(err) {
    if (err)
        throw err;
    else
      console.log("Connected!");
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    var sql = "SELECT password FROM customers where email = ?";
    con.query(sql,[email],function (err, result, fields) {
        console.log(result[0]);  
        if (err){
            console.log(`error th`);
            res.status(401)
            .send({'msg':'Error! Please try again'});
        }
        else if(result[0]){       
                console.log(`no ps`);
                res.status(401)
                .send({'msg':'Email Already Registered!'});       
        }
        else{
            var sql1 = "INSERT INTO customers (email,password) VALUES ( ? , ? )";
            con.query(sql1,[email,password], function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({'msg':'Error registering new user please try again.'});
                } else {
                    console.log('resfrg')
                    res.status(200).send({'msg':"Welcome to the club!"});
                }
            });
        }
    });   
  
});

app.post('/api/authenticate', function(req, res) {
  const { email, password } = req.body; 
  var sql = "SELECT password FROM customers where email = ?";
  con.query(sql,[email],function (err, result, fields) {
    console.log(result[0]);  
    if (err){
        console.log(`error th`);
        res.status(401)
        .send({'error':'Error! Please try again'});
    }
    else if(result[0]){
        if(result[0].password && password === result[0].password){
            console.log(result);
            const payload = { email };
               const token = jwt.sign(payload, secret, {
                 expiresIn: '1h'
               });
            res.cookie('token', token, { expires: new Date(Date.now() + 600000),httpOnly: true }).sendStatus(200);
        }
        else{
            console.log(`no ps`);
            res.status(401)
            .send({'Error':'Incorrect password'});
        }
        
    }
    else {
        console.log(`no em`);
        res.status(401)
        .send({'error':'Email Not Registered'});
    }

  });

});

app.get('/api/logout', function(req, res) {
    res.cookie('token', '12', { expires: new Date(Date.now()),httpOnly: true }).sendStatus(200);
});

app.get('/api/data', withAuth, function(req, res) {
    var email=req.email;
    var sql = "SELECT password FROM customers where email = ?";
    con.query(sql,[email],function (err, result, fields) {
        console.log(result[0]);  
        if (err){
            console.log(`error th`);
            res.status(401)
            .send({'error':'Error! Please try again'});
        }
        else if(result[0]){
            if(result[0].password ){
                res.status(200)
                .send({'email':email,'password':result[0].password});
            }
            else{
                console.log(`no ps`);
                res.status(401)
                .send({'Error':'Error! Please try again'});
            }
            
        }
        else {
            console.log(`no em`);
            res.status(401)
            .send({'error':'Email Not Registered'});
        }

    });

})

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080);
