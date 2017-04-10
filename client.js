'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()

var db
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
app.use("/paskyra",express.static('puslapis'));
app.use("/pamokos",express.static('puslapis'));
app.use("/manopamokos",express.static('puslapis'));
app.use("/pamoka",express.static('puslapis'));
app.use("/prideti/klausima",express.static('puslapis'));
app.use("/login",express.static("puslapis",{index : "login.html"}));
app.use(express.static('public'))
app.use(express.static('puslapis'))

app.get("/", function(req, resp){
	if (req.session["sessionUser"])
	{
		resp.redirect("/paskyra");

	}
	else
	{
		resp.redirect("/login");
	}
});

app.get("/login", function(req, resp){
	if (req.session["sessionUser"])
	{
		resp.redirect("/paskyra");

	}
	else
	{
		resp.redirect("/login");
	}
});
app.post("/login", function(req, resp){
	
	soap.createClient(url, function(error, client) {
    if (error) {
        throw error;
    }

    var data = {
        email:      req.body["email"],
        password:    req.body["slaptazodis"]
    }

    client.describe().AuthService.authPort;
    client.save(data,function(err, res){
            if (err) 
			{
				throw err;
			}
            console.log (res);
			if (res["Login"]==true || res["Login"]=="true")
			{
				req.session.regenerate(function(error){
				if(error)
				{
					throw error;					
				}
				req.session["sessionUser"]=true;
				req.session["email"]= req.body["email"];
				resp.redirect("/");
				})
			}
			else
			{
				resp.send("Nepavyko");
			}			
    });
});
	
});


app.get("/logout", function(request, response){
	if (request.session["sessionUser"])
	{
		request.session.destroy(function(error){
		if(error)
		{
			throw error;
		}
		response.redirect("/login");
		});
	}
	else
	{
		response.redirect("/login");
	}
});
app.get("/pamoka", function(request, response){
	response.sendFile(__dirname + '/puslapis/Prideti_pamoka.html');
	
});
app.get("/paskyra", function(request, response){
	response.sendFile(__dirname + '/puslapis/paskyra.html');
});
app.get('/manopamokos', (req, res) => {
  db.collection('pamoka').find({"emailas": req.session.email}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('pamokos.ejs', {pamoka: result})
  })
})
app.post('/pamoka/prideti', (req, res) => {
	
	db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		emailas:req.session.email,
		tema:req.body.tema,
		aprasymas:req.body.aprasymas,
		kalba:req.body.kalba,
		lygis:req.body.lygis,
		publikuota: false
		
		
		}
  db.collection('pamoka').save(duomenys , (err, result) => {
    if (err) return console.log(err)
    res.redirect("/prideti/klausima");
  })
})
 })

app.get("/prideti/klausima", function(request, response){
	db.collection('klausimas').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    response.render('klausimas.ejs', {klausimas: result})
  })
	
});
app.post("/klausimas/naujas", function(req, res){
	db.collection('klausimas').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas:"",
		uzduotis:"",
		atsakymas:"",
		skaidre:"",
		
		
		}
  db.collection('klausimas').save(duomenys , (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect("/prideti/klausima");
  })
})
});
 app.get('/pamokos', (req, res) => {
  db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('pamokos.ejs', {pamoka: result})
  })
})

app.put('/pamokos', (req, res) => {
  console.log('iki cia daeina')
  var idas=req.body._id
  console.log(idas)
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(idas)}, {
    $set: {
      publikuota: "true"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/pamokos/:id', (req, res) => {
	console.log('iki cia daeina')
	var idas=req.body._id
  db.collection('pamoka').findOneAndDelete({"_id": ObjectId(idas)}, (err, result) => {

    if (err) return res.send(500, err)
		res.send('istrinta')
  })
})

app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


