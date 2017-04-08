'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var name
var email
var pw1
var pw2
var role
var klaida
var db
var kl
var ObjectId = require('mongodb').ObjectID;
MongoClient.connect('mongodb://viko:viko@ds133340.mlab.com:33340/viko', (err, database) => {
  if (err) return console.log(err)
  db = database
})

app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({extended : true}))
app.use(bodyparser.json())
app.use(session({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));

app.use("/",express.static('puslapis'));
app.use("/pamokos",express.static('puslapis'));

app.get("/", function(req, resp){
	resp.render('registration.ejs')
});

app.get("/", function(req, resp){
	resp.render('registration.ejs', {pamoka: userRepository})
	console.log(userRepository)
});


app.post('/register', (req, res) => {
	console.log('iki cia daeina')
	name = req.body.vardas
	email = req.body.email
	pw1 = req.body.pw
	pw2 = req.body.pw2
	role = req.body.optradio
	console.log(name + " " + email + " " + pw1 + " " + pw2 + " " +role );
	if (pw1 != pw2)
	{	
		kl = {
			klaida: "bybys"
			
		}
		res.redirect("/register");
	}
 })
 app.get("/register", function(req, resp){
	db.collection('pamoka').find({"emailas": req.session.email}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    resp.render('registration.ejs', {pamoka: result})
  })
});

app.listen(8002, function () {
  console.log('Linstening on 8002 port!')
})