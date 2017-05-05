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
var db
var kl
var t1
var t2
var passw
var ema
var va
var tl
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
function sendSuccessResponse(response, payload) {
    response.send({
        'success': true,
        'payload': payload
    });
}

app.post('/register/:vardas/:email/:pw/:pw2/:optradio', (req, res) => {
	console.log('as cia')
	console.log(req.params.vardas)
	console.log(req.params.email)
	t1=true
	va=""
	ema=""
	passw=""
	tl=""
	name = req.params.vardas
	email = req.params.email
	pw1 = req.params.pw
	pw2 = req.params.pw2
	role = req.params.optradio
	
	db.collection('users').find({'vardas': name}).toArray((err, result) => {
    if (err) return console.log(err)
		if(result.length > 0) {
			t1=false
			va= 'Toks vardas jau uzimtas'
			emailas()
		}
		else{
			console.log('2')
			emailas()
		}
		
		
	})
	function emailas (){
	db.collection('users').find({'emailas': email}).toArray((err, result) => {
    if (err) return console.log(err)
		if(result.length > 0) {
			t1=false
			ema= 'Toks email jau yra'
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
	if (name == "" || email == "" || pw1 == "" || pw2 == "")
	{
		tl="Palikti tusti laukai"
		t1=false
	}
	function darom(){
		start()
	}
	function start(){
	if (t1==true){
		db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
		
	var duomenys =({
		vardas: name,
		emailas: email,
		pass:pw1,
		rol:role,
		registered: new Date().toLocaleString(),
		pakeistas: new Date().toLocaleString()
		
		
		})
  db.collection('users').save(duomenys, (err, result) => {
    if (err) return console.log(err)
    sendSuccessResponse(res, 'uzregistruotas')
  })
})
	}
	else{
		var temp = [ema, passw, tl, va]
		sendSuccessResponse(res, temp)
	}
}
 })


app.listen(8002, function () {
  console.log('Linstening on 8002 port!')
})