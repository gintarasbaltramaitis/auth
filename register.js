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
var klaida = 'bybys'
var db
var kl
var t1
var t2
var passw
var ema
var va
var userRepository = [
    {
        id : 1,
        name : 'Fun',
        lastname : 'Time',
        created_at : new Date()
    },
    {
        id : 2,
        name : 'Not fun',
        lastname : 'Time',
        created_at : new Date()
    }
];
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
	resp.redirect('/register')
});


app.post('/register', (req, res) => {
	t1=true
	t2=true
	console.log('iki cia daeina')
	name = req.body.vardas
	email = req.body.email
	pw1 = req.body.pw
	pw2 = req.body.pw2
	role = req.body.optradio
	//
	console.log(name + " " + email + " " + pw1 + " " + pw2 + " " +role );
	db.collection('users').find({'vardas': name}).toArray((err, result) => {
    if (err) return console.log(err)
		if(result.length > 0) {
			t2=false
			ema= 'Toks email jau yra'
			emailas()
		}
		else{
			emailas()
		}
		
		
	})
	function emailas (){
	db.collection('users').find({'emailas': email}).toArray((err, result) => {
    if (err) return console.log(err)
		if(result.length > 0) {
			t2=false
			va= 'Toks vardas jau užimtas'
			darom()
		}
		else{
			darom()
		}
		
	})
}	
	//
	if (pw1 != pw2)
	{	t1=false
		passw=  'Nesutampa slaptažodžiai'
	} 
	function darom(){
		start()
	}
	function start(){
		
	if (t1==true && t2 == true){
		db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas: name,
		emailas: email,
		pass:pw1,
		rol:role,
		registered: new Date().toLocaleString(),
		pakeistas: new Date().toLocaleString()
		
		
		}
  db.collection('users').save(duomenys , (err, result) => {
    if (err) return console.log(err)
    res.redirect("register");
  })
})
	}
	else{
		res.render('registration', {
			em:  ema,
			pass: passw,
			vardas: name,
			emailas: email,
			vardass: va
		});
	}
}
 })
 app.get("/register", function(req, resp){
    resp.render('registration');
});

app.listen(8002, function () {
  console.log('Linstening on 8002 port!')
})