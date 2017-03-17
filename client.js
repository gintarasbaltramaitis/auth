'use strict'
var mongoose = require('mongoose');
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
mongoose.connect('mongodb://localhost/pamoka');
var db = mongoose.connection;

app.use(bodyparser.urlencoded({extended : true}));
app.use(session({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));
app.use(express.static('puslapis'))
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
app.get('/pamoka/prideti', function(req, res){

});

app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


