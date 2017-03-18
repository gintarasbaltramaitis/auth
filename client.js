'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var  ilgis
var kilgis
var db

MongoClient.connect('mongodb://viko:viko@ds133340.mlab.com:33340/viko', (err, database) => {
  if (err) return console.log(err)
  db = database
})
app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({extended : true}));
app.use(session({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));
app.use("/pamoka",express.static('puslapis'));
app.use("/prideti/klausima",express.static('puslapis'));
app.use("/login",express.static("puslapis",{index : "login.html"}));

app.get("/", function(req, resp){
	if (req.session["sessionUser"])
	{
		resp.redirect("/pamoka");

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
app.get('/pamokos', (req, res) => {
  db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('pamokos.ejs', {pamoka: result})
  })
})
app.post('/pamoka/prideti', (req, res) => {
	
	db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
    ilgis=result.length;
	var duomenys = {
		emailas:req.session.email,
		tema:req.body.tema,
		aprasymas:req.body.aprasymas,
		kalba:req.body.kalba,
		lygis:req.body.lygis,
		pamokos_id:ilgis
		
		
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
	console.log("as cia")
	db.collection('klausimas').find().toArray((err, result) => {
    if (err) return console.log(err)
    kilgis=result.length;
	var duomenys = {
		vardas:"",
		uzduotis:"",
		atsakymas:"",
		skaidre:"",
		kl_id:kilgis+1,
		pamokos_id:ilgis
		
		
		}
  db.collection('klausimas').save(duomenys , (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect("/prideti/klausima");
  })
})
});
app.post('/pamokos', (req, res) => {
	
	db.collection('klausimas').find().toArray((err, result) => {
    if (err) return console.log(err)
    ilgis=result.length;
	var duomenys = {
		emailas:req.session.email,
		tema:req.body.tema,
		aprasymas:req.body.aprasymas,
		kalba:req.body.kalba,
		lygis:req.body.lygis,
		pamokos_id:ilgis
		
		
		}
  db.collection('pamoka').save(duomenys , (err, result) => {
    if (err) return console.log(err)
    res.redirect("/prideti/klausima");
  })
})
 })
app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


