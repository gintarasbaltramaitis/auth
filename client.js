'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var id
var reques = require('request');
var db
var role
var vard
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
app.use("/atnaujint/:id",express.static('puslapis'));
app.use("/speti/klausima/:kid/:id",express.static('puslapis'));
app.use("/prideti/klausima",express.static('puslapis'));
app.use("/klausimas/naujas/:id",express.static('puslapis'));
app.use("/redaguoti/:id",express.static('puslapis'));
app.use("/login",express.static("puslapis",{index : "login.html"}));
app.use(express.static('public'))
app.use(express.static('puslapis'))

app.get("/", function(req, resp){
	if (req.session["sessionUser"])
	{
	db.collection('users').find({"emailas": req.session.email}).toArray((err, result) => {
    if (err) return console.log(err)
		role=result[0].rol
	})
	db.collection('users').find({"emailas": req.session.email}).toArray((err, result) => {
    if (err) return console.log(err)
		vard=result[0].vardas
	})
	resp.redirect("/paskyra");
	}
	else
	{
		resp.redirect("/login");
	}
});

app.get("/login", function(req, resp){
	resp.redirect("/")
});
app.get("/pamokos", function(req, response){
	var bodyJson
	var bodyJson3
	if (req.session["sessionUser"])
	{
	var options = 
		{
		
			url: 'http://localhost:8003/pamokoos',

		}
		var options2 = 
		{
		
			url: 'http://localhost:8003/destytojai',

		}
		var options3 = 
		{
		
			url: 'http://localhost:8003/nebaigta/' + req.session["email"],

		}
	vienas()
	function vienas(){
	reques.get(options3, function(error, resp, body){
	console.log('siusti')
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        bodyJson3 = JSON.parse(body);
                        tak()
			}
		}
	
	})	
	}
function tak(){
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        bodyJson = JSON.parse(body);
                        testi()
			}
		}
	
	})
}
	function testi(){
	reques.get(options2, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        var bodyJson2 = JSON.parse(body);
						console.log(bodyJson3.payload.length)
                        response.render('pam.ejs', {pamoka: bodyJson.payload, rol: role, destytojai:bodyJson2.payload, rezas: bodyJson3.payload})
			}
		}
	
	})
	}
	}
	else{
		response.redirect("/login");
	}
});
app.get("/manopamokos", function(req, response){
	var bodyJson2
	var bodyJson3
	var bodyJson
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/manopamokos/'+req.session["email"],
}
var options2 = {
    url: 'http://localhost:8003/neisprendziamos/'+req.session["email"],

}
var options3 = {
    url: 'http://localhost:8003/geriausia/'+req.session["email"],

}
reques.get(options2, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        bodyJson2 = JSON.parse(body);
                        testi()
                    }
	}
	})
function testi(){
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        bodyJson = JSON.parse(body);
						last()
                    }
	}
	})
	}
	function last()
	{
		reques.get(options3, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        bodyJson3 = JSON.parse(body);
						console.log(bodyJson3.payload)
                        if(bodyJson2.payload == 'taip' && bodyJson3.payload == 'nera')
						{	var taip = {}
							var taip1
							response.render('pamokos.ejs', {pamoka: bodyJson.payload, rol: role, neispresta: taip, topas: taip1})
						}
						else if(bodyJson2.payload == 'taip' && bodyJson3.payload != 'nera')
						{	var taip = {}
							response.render('pamokos.ejs', {pamoka: bodyJson.payload, rol: role, neispresta: taip, topas: bodyJson3.payload})
						}
						else if(bodyJson2.payload != 'taip' && bodyJson3.payload == 'nera')
						{	var taip
							response.render('pamokos.ejs', {pamoka: bodyJson.payload, rol: role, neispresta: bodyJson2.payload, topas: taip})
						}
						else{
                        response.render('pamokos.ejs', {pamoka: bodyJson.payload, rol: role, neispresta: bodyJson2.payload, topas: bodyJson3.payload})
						}
                    }
	}
	})
	}
	}
	else{
		response.redirect("/login");
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
app.post('/publikuoti/:id', function (req, res) {
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/publikuoti/'+req.params.id,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
             res.redirect('/manopamokos')
                    }
	}
	});}
	else{
		res.redirect("/login");
	}
});
app.post('/nepublikuoti/:id', function (req, res) {
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/nebepublikuoti/'+req.params.id,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
             res.redirect('/manopamokos')
                    }
	}
	});}
	else{
		res.redirect("/login");
	}
});
app.post('/trinti/:id', function (req, res) {
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/pamokos/'+req.params.id,

}
reques.delete(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
             res.redirect('/manopamokos')
                    }
	}
	});}
	else{
		res.redirect("/login");
	}
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
app.get("/paskyra", function(req, response){
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/paskyra/'+req.session["email"],

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        var bodyJson = JSON.parse(body);
                        response.render('paskyra.ejs', {reg: bodyJson.payload})
                    }
	}
	});}
	else{
		response.redirect("/login");
	}
});
app.get("/slaptazodis", function(req, response){
	if (req.session["sessionUser"]){
			var options = {
    url: 'http://localhost:8003/slaptazodis/'+req.session["email"],

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        var bodyJson = JSON.parse(body);
                        response.render('slaptazodis.ejs', {role: role, vard: vard})
                    }
	}
	})}
	else{
		response.redirect("/login");
	}
});
app.post('/slaptazodis', function (req, res) {
	var rez
if (req.session["sessionUser"]){
	
	  db.collection('users').find({"emailas": req.session["email"]}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
		tikrinti()
  })
		function tikrinti(){
		if(req.body.naujas1 != req.body.naujas2) {
			
			res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'nesutampa pass'})
		}
		else if (req.body.senas != rez[0].pass)
			
			{
				res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'blogas senas pass'})
			}
		else{
			var options = {
    url: 'http://localhost:8003/slapt/'+req.session["email"] + '/' + req.body.naujas1,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
                        var bodyJson = JSON.parse(body);
                        res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'pakeista'})
        }
					
	}
		})}}

}
	
	
	
	
	
	else{
		res.redirect("/login");
	}
})
app.get("/vardas", function(req, response){
	if (req.session["sessionUser"]){
			var options = {
    url: 'http://localhost:8003/vardas/'+req.session["email"],

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        var bodyJson = JSON.parse(body);
                        response.render('vardas.ejs', {role: role, vard: vard})
                    }
	}
	})}
	else{
		response.redirect("/login");
	}
});
app.post('/vardas', function (req, res) {
	var rez
if (req.session["sessionUser"]){
	
	  db.collection('users').find({"vardas": req.body.senas}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
		tikrinti()
  })
		function tikrinti(){
		if(rez.length != 0) {
			
			res.render('vardas.ejs', {role: role, vard: vard, pake: 'Toks vardas jau uzimtas'})
		}
		else{
			var options = {
    url: 'http://localhost:8003/vard/'+req.session["email"] + '/' + req.body.senas,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
                        var bodyJson = JSON.parse(body);
                        res.redirect('/')
        }
					
	}
		})}}

}
	
	
	
	
	
	else{
		res.redirect("/login");
	}
})
app.get("/pamoka", function(req, res){
	if (req.session["sessionUser"]){
		res.render('prideti_pam.ejs')
	}
	else{
		res.redirect("/login");
	}
})
app.post("/pamoka/prideti", function(req, res){
	if (req.session["sessionUser"])
	{
		if(req.body.tema == "" || req.body.aprasymas == "")
		{
		var zin="Kažkur palikti tušti laukai"
		res.render('prideti_pam.ejs', {zinute: zin})
		}
		else{
			var options = {
    url: 'http://localhost:8003/pamoka/prideti/'+req.session["email"] + '/' + req.body.tema + '/' + req.body.aprasymas + '/' + req.body.kalba + '/' + req.body.lygis + '/' + vard,

}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{	
		res.redirect("/");
        }
	}
	})
		}
	}
	else{
		res.redirect("/login");
	}
})
app.get('/redaguoti/:id', function (req, res) {
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/pam/'+req.params.id,

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
			var bodyJson = JSON.parse(body)
             res.render('atnaujinti.ejs', {tema: bodyJson.payload[0].tema, aprasymas: bodyJson.payload[0].aprasymas , kalba: bodyJson.payload[0].kalba , lygis: bodyJson.payload[0].lygis  , pamoka: bodyJson.payload[0]._id})  
                    }
	}
	});}
	else{
		res.redirect("/login");
	}
});
app.post("/atnaujinti/:id", function(req, res){
	console.log(req.params.lygis)
	if(req.body.tema == "" || req.body.aprasymas == "")
		{
		var zin="Kažkur palikti tušti laukai"
		res.render('prideti_pam.ejs', {zinute: zin})
		}
		else{
			
			var options = {
    url: 'http://localhost:8003/pamoka/atnaujinti/'+req.params.id + '/' + req.body.tema + '/' + req.body.aprasymas + '/' + req.body.kalba + '/' + req.params.lygis,
}
	console.log(req.body.tema)
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		console.log('cia')
		if (!error && resp.statusCode == 200) {
        var bodyJson = JSON.parse(body);
        res.redirect('/')
                    }
	}
	})
		}

})
app.get("/redaguoti/klausimus/:id", function(req, res){
	if (req.session["sessionUser"]){
		var options = {
    url: 'http://localhost:8003/klausimai/'+req.params.id,

}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
                        var bodyJson = JSON.parse(body);
						if (bodyJson.payload == 'dar')
						{
							res.redirect('/redaguoti/klausimus/' + req.params.id)
						}
						else{
                        res.render('klausimas.ejs', {kiekis: bodyJson.payload})
						}
        }
					
	}
		})
	}
	else{
		res.redirect("/login");
	}
})
app.get("/klausimas/naujas/:id", function(req, res){

			var options = {
    url: 'http://localhost:8003/naujas/klausimas/'+req.params.id,

}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
        var bodyJson = JSON.parse(body);
        res.render('klausimas.ejs', {kiekis: bodyJson.payload})
                    }
	}
	})

})
app.get("/klausimas/naujas/:kid/:id", function(req, res){

			var options = {
    url: 'http://localhost:8003/konkretus/klausimas/'+req.params.kid + '/' + req.params.id,

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
        var bodyJson = JSON.parse(body);
		for(var i = 0; i<bodyJson.payload.length; i++)
		{
			if (bodyJson.payload[i].kl_id == req.params.kid)
			{
			res.render('klausimas.ejs', {kiekis: bodyJson.payload, klausimas: bodyJson.payload[i]})
			}
		}
                    }
	}
	})

})
app.post("/klausimas/saugoti/:kid/:id", function(req, res){
	console.log(req.body.vardas)
			var options = {
    url: 'http://localhost:8003/atnaujinti/klausimas/'+req.params.kid + '/' + req.params.id + '/' + req.body.vardas + '/' + req.body.uzduotis + '/' + req.body.atsakymas + '/' + req.body.skaidre,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
		res.redirect('/')
                    }
	}
	})

})
app.post("/filtruoti", function(req, res){
	var bodyJson
	var options = {
    url: 'http://localhost:8003/filtras/'+req.body.kalba + '/' + req.body.lygis + '/' + req.body.destytojas,

}
var options2 = 
		{
		
			url: 'http://localhost:8003/destytojai',

		}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
		bodyJson = JSON.parse(body);
        testi()
                    }
	}
	})
		function testi(){
	reques.get(options2, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        var bodyJson2 = JSON.parse(body);
						var tuscias = {}
						console.log(tuscias)
                        res.render('pam.ejs', {pamoka: bodyJson.payload, rol: role, destytojai:bodyJson2.payload, rezas: tuscias})
			}
		}
	
	})
	}


})
app.get("/pradeti/:id/:email", function(req, res){

	var options = {
    url: 'http://localhost:8003/pradeti/'+ req.params.id + '/' + req.session["email"] + '/' + req.params.email,

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
        var bodyJson = JSON.parse(body);
		if(bodyJson.payload == 'pamoka jau daroma')
		{
			res.redirect('/')
		}
		else
		{
			var i = 1
			res.redirect('/speti/klausima/' + i + '/' + req.params.id)
		}
      }
	}
	})

})
app.get("/speti/klausima/:kid/:id", function(req, res){
var bodyJson
	var options = {
    url: 'http://localhost:8003/spresti/'+ req.params.kid + '/' + req.params.id,
}
var options2 = {
    url: 'http://localhost:8003/kiekis/'+ req.params.kid + '/' + req.params.id,

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
        bodyJson = JSON.parse(body);
		dar()
		}
	}
	})
	function dar()
	{
		reques.get(options2, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
        var bodyJson2 = JSON.parse(body);
		res.render('spresti.ejs', {klausimas: bodyJson.payload, kl: req.params.kid, kiekis: bodyJson2.payload, id: req.params.id})
		}
	}
	})
	}

})
app.post("/spresti/:kid/:id", function(req, res){
	var bodyJson
	var options = {
    url: 'http://localhost:8003/tikrinti/'+ req.params.kid + '/' + req.params.id + '/' + req.body.atsakymas + '/' + req.session["email"],
}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
        bodyJson = JSON.parse(body);
			console.log('tak')
			console.log(bodyJson.payload)
			if (bodyJson.payload == 'teisingai')
			{	var sk= parseInt(req.params.kid) + 1
				console.log(sk)
				res.redirect('/speti/klausima/' + sk + '/' + req.params.id)
			}
			else if (bodyJson.payload == 'sveikinu')
			{	
				res.redirect('/')
			}
			else{
			res.redirect('/speti/klausima/' + req.params.kid + '/' + req.params.id)
			}
		}
	}
	})


})
app.get("/testi/:id", function(req, res){
	var options = {
    url: 'http://localhost:8003/testi/'+ req.session["email"],
}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
       var bodyJson = JSON.parse(body);
	   var test = bodyJson.payload
	   console.log(test)
			res.redirect('/speti/klausima/' + test + '/' + req.params.id)
		}
	}
	})


})
app.get("/register", function(req, res){
	res.render('registration.ejs')
})
app.post("/register", function(req, res){
	var options = {
    url: 'http://localhost:8002/register/'+ req.body.vardas + '/' + req.body.emailas + '/' + req.body.pw + '/' + req.body.pw2 + '/' + req.body.optradio,
}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
			var bodyJson = JSON.parse(body);
			console.log(bodyJson.payload)
			if(bodyJson.payload == 'uzregistruotas')
			{
				res.redirect('/')
			}
			else{
				res.render('registration.ejs', {em: bodyJson.payload[0], pass: bodyJson.payload[1], tuscia: bodyJson.payload[2], vardass: bodyJson.payload[3]})
			}

		}
	}
	})

})
app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


