'use strict'
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()

app.use(bodyparser.urlencoded({extended : true}));
app.use(session({secret: "DuGaideliaiZirniusKule" , resave : false , saveUninitialized : true}));
app.use("/login",express.static("html",{index : "login.html"}));

app.get("/", function(req, resp){
	if (req.session["sessionUser"])
	{
		resp.send("Sveiki " + req.session["email"]+'<br><a href="/logout">Logout</a>')
	}
	else
	{
		resp.redirect("/login");
	}
});

app.post("/login", function(req, response){
	
	soap.createClient(url, function(error, client) {
    if (error) {
        throw error;
    }

    var data = {
        email:      req.body["email"],
        password:    req.body["slaptazodis"]
    }

    client.describe().AuthenticationService.authenticationPort;
    client.save(data,function(err,res){
            if (err) 
			{
				throw err;
			}
            console.log (res);
			if (res["isLogin"]==true || res["isLogin"]=="true")
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


app.get("/logout", function(req, resp){
		req.session.destroy(function(error){
		if(error)
		{
			throw error;
		}
		});
	}
		else
	{
		resp.redirect("/login");
	}
});


app.listen(3000, function () {
  console.log('VK-auth app listening on port 3000!')
})


