'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var id
var db
var encrypted
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
app.use("/slaptazodis",express.static('puslapis'));
app.use("/prideti/klausima",express.static('puslapis'));
app.use("/login",express.static("puslapis",{index : "login.html"}));
app.use(express.static('public'))
app.use(express.static('puslapis'))

app.get("/", function(req, resp){
	if (req.session["sessionUser"])
	{
	db.collection('users').find({"emailas": req.session.email}).toArray((err, result) => {
    if (err) return console.log(err)
    id=result[0]._id
	siunciam()
  })
		function siunciam(){
		resp.redirect('http://localhost:8003/paskyra/' + id);
		}

	}
	else
	{
		resp.redirect("/login");
	}
});

app.get("/login", function(req, resp){
	resp.redirect("/")
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


app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


