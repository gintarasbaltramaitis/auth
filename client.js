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
var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];
var aesjs = require('aes-js');
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
app.use("/klausimas/naujass/:id",express.static('puslapis'));
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
	if (role == 2){
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
	}
	else{
		response.redirect("/pamokos");
	}
});
app.post("/login", function(req, resp){
	var bodyJson3
		var options = 
		{
		
			url: 'http://localhost:8003/vartotojai',

		}
		reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        bodyJson3 = JSON.parse(body);
						daryti()
                        
			}
		}
	
	})
	function daryti(){
	soap.createClient(url, function(error, client) {
    if (error) {
        throw error;
    }
	var p1 = aesjs.utils.utf8.toBytes(req.body.slaptazodis);
	var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	var encryptedBytes = aesCtr.encrypt(p1);
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	var users = []
	var pass = []
	for (var i=0; i<bodyJson3.payload.length; i++){
		users[i] = bodyJson3.payload[i].emailas
		pass[i] = bodyJson3.payload[i].pass
	}
    var data = {
        email:      req.body["email"],
        password:    encryptedHex,
		user: 		users,
		passUser:	pass
    }

    client.describe().AuthService.authPort;
    client.save(data, function(err, res){
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
				resp.redirect("/");
			}			
    });
	});}
	
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
	var p1 = aesjs.utils.utf8.toBytes(req.body.naujas1);
	var p2 = aesjs.utils.utf8.toBytes(req.body.senas);
	var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	var aesCtr2 = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	var encryptedBytes = aesCtr.encrypt(p1);
	var encryptedBytes2 = aesCtr2.encrypt(p2);
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	var encryptedHex2 = aesjs.utils.hex.fromBytes(encryptedBytes2);
if (req.session["sessionUser"]){
	
	  db.collection('users').find({"emailas": req.session["email"]}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
		tikrinti()
  })
		function tikrinti(){
		if(req.body.naujas1 != req.body.naujas2) {
			
			res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'Nesutampa slaptažodžiai'})
		}
		else if(req.body.naujas1 == '' || req.body.naujas2 == '' || req.body.naujas1 == '') {
			
			res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'Palikti tušti laukai'})
		}
		else if (encryptedHex2 != rez[0].pass)
			
			{
				console.log(rez[0].pass)
				res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'Blogas senas slaptažodis'})
			}
		else{
			var options = {
    url: 'http://localhost:8003/slapt/'+req.session["email"],
	form: 
		{
			pass: encryptedHex
		}

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
                        var bodyJson = JSON.parse(body);
                        res.render('slaptazodis.ejs', {role: role, vard: vard, pake: 'Pakeista'})
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
		if (req.body.senas=='')
		{
			res.render('vardas.ejs', {role: role, vard: vard, pake: 'Tuscias laukas'})
		}
		else if(rez.length != 0) {
			
			res.render('vardas.ejs', {role: role, vard: vard, pake: 'Toks vardas jau uzimtas'})
		}
		else{
			var options = {
    url: 'http://localhost:8003/vard/'+req.session["email"],
	form: 
		{
			vardas: req.body.senas
		}

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
                        var bodyJson = JSON.parse(body);
                        res.redirect('/keisti/' + req.body.senas)
        }
					
	}
		})}}

}
	
	
	
	
	
	else{
		res.redirect("/login");
	}
})
app.get("/pamoka", function(req, res){
	if (role == 2){
	if (req.session["sessionUser"]){
		res.render('prideti_pam.ejs')
	}
	else{
		res.redirect("/login");
	}
	}
	else{
		res.redirect("/paskyra");
	}

})
app.post("/pamoka/prideti", function(req, res){
	var id
	if (req.session["sessionUser"])
	{
		if(req.body.tema == "" || req.body.aprasymas == "")
		{
		var zin="Kažkur palikti tušti laukai"
		res.render('prideti_pam.ejs', {zinute: zin})
		}
		else{
			var options = {
    url: 'http://localhost:8003/pamoka/prideti/'+req.session["email"],
	form: 
		{
			tema: req.body.tema,
			aprasymas: req.body.aprasymas,
			kalba: req.body.kalba,
			lygis: req.body.lygis,
			vard: vard
		}

}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{	var bodyJson = JSON.parse(body);
			id=bodyJson.payload[0]._id
			res.redirect("/redaguoti/klausimus/" + id);
        }
	}
	})
		}
	}
	
else{res.redirect("/paskyra");}
})
app.get('/redaguoti/:id', function (req, res) {
	if (role == 2){
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/pam/'+req.params.id,

}
reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
			var bodyJson = JSON.parse(body)
             res.render('atnaujinti.ejs', {tema: bodyJson.payload[0].tema, aprasymas: bodyJson.payload[0].aprasymas , kalba: bodyJson.payload[0].kalba , lygis: 
bodyJson.payload[0].lygis  , pamoka: bodyJson.payload[0]._id})  
                    }
	}
	});}
	else{
		res.redirect("/login");
	}
	}
	else{res.redirect("/paskyra");}
});
app.post("/atnaujinti/:id", function(req, res){
	if(req.body.tema == "" || req.body.aprasymas == "")
		{
		var zin="Kažkur palikti tušti laukai"
		res.render('prideti_pam.ejs', {zinute: zin})
		}
		else{
			
			var options = {
    url: 'http://localhost:8003/pamoka/atnaujinti/'+req.params.id,
	form:
		{
			tema:req.body.tema,
			aprasymas:req.body.aprasymas,
			kalba:req.body.kalba,
			lygis:req.body.lygis
			
		}
}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
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
						
                        res.redirect('/')
						}
        }
					
	}
		})
	}
	else{
		res.redirect("/login");
	}
})
app.get("/klausimas/naujass/:id", function(req, res){
	if (req.session["sessionUser"]){
	var ilgis
	var id
			var options = {
    url: 'http://localhost:8003/naujas/klausimas/'+req.params.id,

}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
        var bodyJson = JSON.parse(body);
		ilgis = bodyJson.payload.length
		id = bodyJson.payload[0].pamokos_id
        res.redirect('/klausimas/naujas/' + ilgis + '/' + id)
                    }
	}
	})
	}
	else{
		res.redirect('/')
	}

})
app.get("/klausimas/naujas/:kid/:id", function(req, res){
	var skaidres
	
	if (req.session["sessionUser"]){
		var options1 = {
    url: 'http://localhost:8003/kurejas/'+req.params.id,

}
reques.get(options1, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
                        var bodyJson = JSON.parse(body);
                        if (bodyJson.payload.length != 0)
						{
							if (bodyJson.payload[0].emailas == req.session["email"])
								
								{
									var options2 = {
							url: 'http://localhost:8003/kiek/'+req.params.id,

									}
									reques.get(options2, function(error, resp, body){
							if(error) console.log(error);
							else {
							if (!error && resp.statusCode == 200) {
							var bodyJson = JSON.parse(body)
							  if (req.params.kid <= bodyJson.payload.length && req.params.kid>=1)
								  
								  
								  {
									  var dydis
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
			skaidres = bodyJson.payload[i].skaidre
			var resas = skaidres.split(",")
			res.render('klausimas.ejs', {kiekis: bodyJson.payload, klausimas: bodyJson.payload[i], sk: resas})
			}
		}
                    }
	}
	})
								  }
								  
								  else{
									  res.redirect('/klausimas/naujas/' + 1 + '/' + req.params.id)
								  }
								}
								}
										})

					
								}
								else{
							res.redirect('/')
						}
						}
						
						else{
							res.redirect('/')
						}
                    }
	}
	})
		
	}
	else{
		res.redirect('/')
	}
})
app.post("/klausimas/saugoti/:kid/:id", function(req, res){
	var testi = true
	var masyvas = []
	if(req.body.vardas == '' || req.body.uzduotis == '' || req.body.atsakymas == ''){
		res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)

	}
	else{
		if (req.body.skaidre.constructor != Array)
		{
			if (req.body.skaidre != ''){
				masyvas=req.body.skaidre
			daryti()
			}
			else{
				res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)
			}
			
		}
		else
		{
		for(var i=0; req.body.skaidre.length>i; i++)
		{
			if (req.body.skaidre[i] == '')
			{
				
				testi=false
				
			}
			else{
				masyvas[i] = req.body.skaidre[i]
				
			}
			
		}
		daryti()
		
	}
}
function daryti(){
		if (testi == true){
		var options = {
    url: 'http://localhost:8003/atnaujinti/klausimas/'+req.params.kid + '/' + req.params.id,
	form:{
		vardas: req.body.vardas,
		uzduotis: req.body.uzduotis,
		atsakymas: req.body.atsakymas,
		skaidre: masyvas.toString()
	}

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
		res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)
                    }
	}
	})
		}
		else{res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)}
	}

})
app.post("/filtruoti", function(req, res){
	var bodyJson
	var options = {
    url: 'http://localhost:8003/filtras/',
	form:
		{
			kalba: req.body.kalba,
			lygis: req.body.lygis,
			destytojas: req.body.destytojas
		}

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
                        res.render('pam.ejs', {pamoka: bodyJson.payload, rol: role, destytojai:bodyJson2.payload, rezas: tuscias})
			}
		}
	
	})
	}


})
app.get("/pradeti/:id/:email", function(req, res){

	var options = {
    url: 'http://localhost:8003/pradeti/'+ req.params.id,
	form: {
		email: req.session["email"],
		email2: req.params.email
	}

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
	if (req.session["sessionUser"]){
	var bodyJson11
	var options11 = {
	url: 'http://localhost:8003/daromaPam/'+ req.session["email"],
}
reques.get(options11, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
        bodyJson11 = JSON.parse(body);
		if (bodyJson11.payload[0].daroma == req.params.id && bodyJson11.payload[0].kl == req.params.kid)
			
			{
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
		var skaidres = bodyJson.payload[0].skaidre
		var resas = skaidres.split(",")
        var bodyJson2 = JSON.parse(body);
		res.render('spresti.ejs', {klausimas: bodyJson.payload, kl: req.params.kid, kiekis: bodyJson2.payload, id: req.params.id, sk: resas, rol: role})
		}
	}
	})
	}
			}
			else{res.redirect('/pamokos')}
		}
	}
	})

	}
	else{
		res.redirect("/")
	}

})
app.post("/spresti/:kid/:id", function(req, res){
	if(req.body.atsakymas != '') {
	var bodyJson
	var options = {
    url: 'http://localhost:8003/tikrinti/'+ req.params.kid + '/' + req.params.id,
	form:{
		atsakymas: req.body.atsakymas,
		email: req.session["email"]
	}
}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
        bodyJson = JSON.parse(body);
			if (bodyJson.payload == 'teisingai')
			{	var sk= parseInt(req.params.kid) + 1
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
	}
	else{
		res.redirect('/speti/klausima/' + req.params.kid + '/' + req.params.id)
	}

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
			res.redirect('/speti/klausima/' + test + '/' + req.params.id)
		}
	}
	})


})
app.get("/register", function(req, res){
	res.render('registration.ejs')
})
app.post("/register", function(req, res){
	var p1 = aesjs.utils.utf8.toBytes(req.body.pw);
	var p2 = aesjs.utils.utf8.toBytes(req.body.pw2);
	var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	var aesCtr2 = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	var encryptedBytes = aesCtr.encrypt(p1);
	var encryptedBytes2 = aesCtr2.encrypt(p2);
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	var encryptedHex2 = aesjs.utils.hex.fromBytes(encryptedBytes2);
	var options = {
    url: 'http://localhost:8002/register',
	form: {
			vardas: req.body.vardas,
			email: req.body.emailas,
			pw: encryptedHex,
			pw2: encryptedHex2,
			optradio: req.body.optradio
		}
}
reques.post(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
		{
			var bodyJson = JSON.parse(body);
			if(bodyJson.payload == 'uzregistruotas')
			{
				res.redirect('/')
			}
			else{
				res.render('registration.ejs', {em: bodyJson.payload[0], pass: bodyJson.payload[1], tuscia: bodyJson.payload[2], vardass: bodyJson.payload[3], vardas: 
bodyJson.payload[4], emailas:bodyJson.payload[5]})
			}

		}
	}
	})

})
app.get("/user", function(req, res){
	var options = 
		{
		
			url: 'http://localhost:8003/vartotojai',

		}
		reques.get(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        var bodyJson3 = JSON.parse(body);
                        
			}
		}
	
	})
})
app.get("/keisti/:vardas", function(req, res){
	var options = 
		{
		
			url: 'http://localhost:8003/keistiPamokosVarda',
			form:{
			email: req.session["email"],
			vardas: req.params.vardas
			}

		}
		reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) 
			{
                        res.redirect('/')
                        
			}
		}
	
	})
})
app.get('/naujaSkaidre/:kid/:id', function (req, res) {
	if (role == 2){
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/naujaSkaidre/'+req.params.kid + '/' + req.params.id,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
			var bodyJson = JSON.parse(body)
             res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)
	}
	}
	});
	}
	else{
		res.redirect("/login");
	}
	}
	else{res.redirect("/paskyra");}
});
app.get('/istrintiSkaidre/:kid/:id/:sk', function (req, res) {	
	if (role == 2){
	if (req.session["sessionUser"]){
		
	var options = {
    url: 'http://localhost:8003/istrintiSkaidre/'+req.params.kid + '/' + req.params.id + '/' + req.params.sk,

}
reques.put(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
			var bodyJson = JSON.parse(body)
             res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)
	}
	}
	});
	}
	else{
		res.redirect("/login");
	}
	}
	else{res.redirect("/paskyra");}
});
app.get('/istrintiKlausima/:kid/:id', function (req, res) {	
	if (role == 2){
	if (req.session["sessionUser"]){
	var options = {
    url: 'http://localhost:8003/istrintiKlausima/'+req.params.kid + '/' + req.params.id,

}
reques.delete(options, function(error, resp, body){
    if(error) console.log(error);
    else {
		if (!error && resp.statusCode == 200) {
			var bodyJson = JSON.parse(body)
             res.redirect('/klausimas/naujas/' + req.params.kid + '/' + req.params.id)
	}
	}
	});
	}
	else{
		res.redirect("/login");
	}
	}
	else{res.redirect("/paskyra");}
});

app.listen(3000, function () {
  console.log('Linstening on 3000 port!')
})


