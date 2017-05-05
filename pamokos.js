'use strict'
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var url = 'http://localhost:8001/imam?wsdl';
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var rez
var kl_id
var ilgis
var idas
var pam
var tem
var ap
var rezas
var prisijunges
var tiesa
var vard
var vardas
var role
var pak
var taip
var zin
var zin2
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
app.use("/vardas",express.static('puslapis'));
app.use("/pamoka",express.static('puslapis'));
app.use("/spresti/:kid/:id",express.static('puslapis'));
app.use("/redaguoti/:id",express.static('puslapis'));
app.use("/slaptazodis",express.static('puslapis'));
app.use("/prideti/klausima",express.static('puslapis'));
app.use("/klausimas/naujas/:kid:id",express.static('puslapis'));

app.use(express.static('public'))
app.use(express.static('puslapis'))

app.get("/", function(req, res){
res.redirect("/paskyra")
})

function sendErrorResponse(response, payload) {
    response.send({
        'success': false,
        'payload': payload
    });
}
function sendSuccessResponse(response, payload) {
    response.send({
        'success': true,
        'payload': payload
    });
}
app.get('/paskyra/:email', function(req, res){
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)
    sendSuccessResponse(res, result)
	})
})
app.get('/slaptazodis/:email', function(req, res){
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
		
});
app.put('/slapt/:email/:old', (req, res) => {

	db.collection('users')
	.findOneAndUpdate({"emailas": req.params.email}, {
    $set: {
      pass: req.params.old,
	  pakeistas: new Date().toLocaleString()
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    sendSuccessResponse(res, result)
	
  })
		
	
  
})
app.get("/vardas/:email", function(req, res){
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
})
app.put('/vard/:email/:old', (req, res) => {
			db.collection('users')
		.findOneAndUpdate({"emailas": req.params.email}, {
    $set: {
      vardas: req.params.old
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
	sendSuccessResponse(res, result)
	
  })
		
  
})

app.get('/pamokoos', function (req, res) {
    db.collection('pamoka').find({"publikuota": "true"}).toArray((err, result) =>{
        sendSuccessResponse(res, result);

    });
});
app.get('/manopamokos/:email', (req, res) => {
  db.collection('pamoka').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)	
	sendSuccessResponse(res, result)
  })
})
app.put('/publikuoti/:id', (req, res) => {
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
    $set: {
      publikuota: "true"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    sendSuccessResponse(res, result)
  })
})
app.put('/nebepublikuoti/:id', (req, res) => {
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
    $set: {
      publikuota: "false"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    sendSuccessResponse(res, result)
  })
})
app.delete('/pamokos/:id', (req, res) => {
  db.collection('pamoka').findOneAndDelete({"_id": ObjectId(req.params.id)}, (err, result) => {

    if (err) return console.log(err)
  })
  db.collection('klausimas').deleteMany({"pamokos_id": ObjectId(req.params.id)}, (err, result) => {

    if (err) return console.log(err)
		sendSuccessResponse(res, result)
  })
})
app.get("/redaguoti/:id", function(req, res){
		if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	pam=req.params.id
	db.collection('pamoka').find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
	rez=result
	res.render('atnaujinti.ejs', {
		tema: rez[0].tema,
		apra: rez[0].aprasymas,
		kalba: rez[0].kalba,
		lygis: rez[0].lygis
		
		})
	
	})
		}
})
app.get("/pam/:id", function(req, res){
	db.collection('pamoka').find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
})
app.get("/destytojai", function(req, res){
	db.collection('users').find({rol: '2'}).toArray((err, result) => {
    if (err) return console.log(err);
	sendSuccessResponse(res, result)
	
	})
})
app.put('/pamoka/atnaujinti/:id/:tema/:aprasymas/:kalba/:lygis', (req, res) => {	
	console.log(req.params.tema)
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
    $set: {
      tema: req.params.tema,
	  aprasymas: req.params.aprasymas,
	  kalba: req.params.kalba,
	  lygis: req.params.lygis
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err){ return res.send(err)}
	sendSuccessResponse(res, result)
  })

 
	
})	
app.get("/klausimas/:id", function(req, res){
	db.collection('klausimas').find({pamokos_id: ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
	sendSuccessResponse(res, result)
	
	})
})
app.post('/pamoka/prideti/:email/:tema/:aprasymas/:kalba/:lygis/:vard', (req, res) => {
	db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas: req.params.vard,
		emailas:req.params.email,
		tema:req.params.tema,
		aprasymas:req.params.aprasymas,
		kalba:req.params.kalba,
		lygis:req.params.lygis,
		publikuota: "false",
		sukurta: (new Date()).toISOString().slice(0,10),
		kartu: "0"
		
		
		}
  db.collection('pamoka').save(duomenys , (err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
   
  })
})

 })

app.post("/klausimai/:id", function(req, res){
	var rez
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
	toliau()
})
	function toliau()
	{
		if (rez.length == 0)
		{
		var ilgis=1
		db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
		if (err) return console.log(err)
		var duomenys = {
		vardas:"",
		uzduotis:"",
		atsakymas:"",
		skaidre:"",
		pamokos_id: ObjectId(req.params.id),
		kl_id: ilgis
		
		
		}
  db.collection('klausimas').save(duomenys , (err, resultas) => {
    if (err) return console.log(err)
    sendSuccessResponse(res, 'dar')
  })
})
		}
		else
		{
		db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
		if (err) return console.log(err)
		sendSuccessResponse(res, result)
		})
		}
		
		
		
	}
});
app.post("/naujas/klausimas/:id", function(req, res){
	var rez
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		console.log(result)
		rez=result
	toliau()
})
	function toliau()
	{
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas:"",
		uzduotis:"",
		atsakymas:"",
		skaidre:"",
		pamokos_id: ObjectId(req.params.id),
		kl_id: rez.length + 1
		
		
		}
  db.collection('klausimas').save(duomenys , (err, resultas) => {
    if (err) return console.log(err)
	daryti()
  })
})
	}
	function daryti()
	{
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
	}
		
		
		
	
});
app.get("/konkretus/klausimas/:kid/:id", function(req, res){

	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
})
	
});
app.put('/atnaujinti/klausimas/:kid/:id/:vardas/:uzduotis/:atsakymas/:skaidre', (req, res) => {
  console.log(req.params.id)
  console.log(req.params.vardas)
  console.log(req.params.skaidre)
  db.collection('klausimas')
  .findOneAndUpdate({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}, {
    $set: {
      vardas: req.params.vardas,
	  uzduotis: req.params.uzduotis,
	  atsakymas: req.params.atsakymas,
	  skaidre: req.params.skaidre,
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    sendSuccessResponse(res, result)
  })
})
app.get('/filtras/:kalba/:lygis/:destytojas', (req, res) => {
	console.log(req.params.kalba)



		if(req.params.kalba == 'Visi' && req.params.lygis == 'Visi' && req.params.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true'}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
		}
		else if(req.params.kalba != 'Visi' && req.params.lygis == 'Visi' && req.params.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', kalba: req.params.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.params.kalba == 'Visi' && req.params.lygis != 'Visi' && req.params.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', lygis: req.params.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.params.kalba == 'Visi' && req.params.lygis == 'Visi' && req.params.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.params.destytojas}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.params.kalba != 'Visi' && req.params.lygis != 'Visi' && req.params.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', kalba: req.params.kalba, lygis: req.params.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.params.kalba != 'Visi' && req.params.lygis == 'Visi' && req.params.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.params.destytojas, kalba: req.params.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.params.kalba == 'Visi' && req.params.lygis != 'Visi' && req.params.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.params.destytojas, lygis: req.params.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.params.destytojas, lygis: req.params.lygis, kalba: req.params.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
		}
	
	
})


app.get('/pradeti/:id/:email/:email2', (req, res) => {
	var rez
	var kartai
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err){ return console.log(err)}
		console.log(result)
		rez=result
		toliau()
	})
	function toliau()
	{
		
		if (rez[0].daroma== undefined || rez[0] == 'nera')
		{
	    db.collection('pamoka').find({"_id": ObjectId(req.params.id)}).toArray((err, result) =>{
			kartai=parseInt(result[0].kartu)+1
			console.log(kartai)
			console.log('cia')
			update()

		});
		function update(){
		db.collection('users')
		.findOneAndUpdate({"emailas": req.params.email}, {
		$set: {
		daroma: req.params.id,
		kl: 1,
		kieno: req.params.email2
		}
		}, {
		sort: {_id: -1},
		upsert: true
		}, (err, result) => {
		if (err) return res.send(err)
		})
				db.collection('pamoka')
		.findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
		$set: {
		kartu: kartai
		}
		}, {
		sort: {_id: -1},
		upsert: true
		}, (err, result) => {
		if (err) return res.send(err)
			sendSuccessResponse(res, result)
		})
		}
		}
		else 
		{
			sendSuccessResponse(res, 'pamoka jau daroma')
		}
		
	}

	
	
})
app.get("/spresti/:kid/:id", function(request, response){

	db.collection('klausimas').find({"kl_id": parseInt(request.params.kid) , "pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
	sendSuccessResponse(response, result)
  })

  // response.render('spresti.ejs', {klausimas: masyvas, kl: request.params.kid, kiekis: masyv, id: request.params.id, zinute: zin})
});
app.get("/kiekis/:kid/:id", function(request, response){

  db.collection('klausimas').find({"pamokos_id": ObjectId(request.params.id) }).sort({"kl_id": 1}).toArray((err, result) => {
    if (err) return console.log(err)
	sendSuccessResponse(response, result)
  })

  // response.render('spresti.ejs', {klausimas: masyvas, kl: request.params.kid, kiekis: masyv, id: request.params.id, zinute: zin})
});
app.put("/tikrinti/:kid/:id/:atsakymas/:email", function(req, res){
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}).toArray((err, result) => {
    if (err){ return console.log(err)}
		rez=result[0].atsakymas
		tikrinti()
	})
	function tikrinti()
	{	var tarp
		if(rez == req.params.atsakymas)
		{
			db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
		if (err){ return console.log(err)}
		tarp=result.length
		console.log(result.length)
		toliau()
		})
		function toliau()
		{
			if(req.params.kid == tarp)
			{
				
				db.collection('users').update({"emailas": req.params.email}, {$unset: {"daroma": 1}})
				db.collection('users').update({"emailas": req.params.email}, {$unset: {"kl": 1}})
				db.collection('users').update({"emailas": req.params.email}, {$unset: {"kieno": 1}})
				sendSuccessResponse(res, 'sveikinu')
			}
			else
			{
				var du =parseInt(req.params.kid) + 1
				  db.collection('users')
				.findOneAndUpdate({"emailas": req.params.email}, {
				$set: {
				kl: du
				}
				}, {
				sort: {_id: -1},
				upsert: true
				}, (err, result) => {
				if (err){ return res.send(err)}
				sendSuccessResponse(res, 'teisingai')
				})
				
			}
		}
			
		}
		else
		{
			sendSuccessResponse(res, 'super')
		}
		
	}

});
app.post("/spresti/:kid/:id", function(request, response){
	zin='neteisingas atsakymas'
	var klausimo_nr = request.params.kid
	var klausimu
	var kl
	db.collection('klausimas').find({"kl_id": parseInt(request.params.kid) , "pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
		kl=result[0].atsakymas
		t()
		})
	function t(){
		db.collection('klausimas').find({"pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
		klausimu=result.length
		m()
		})
		
	}
	function m(){
	if(request.body.atsakymas == kl)
	{	
		if(klausimu == request.params.kid){
			response.send('Sveikinu issprendus')
			
		}
		else{
		klausimo_nr = parseInt(klausimo_nr) + 1
		zin=""
		response.redirect("/spresti/"+ klausimo_nr + "/" + request.params.id)
		}
	}
	else{
		response.redirect("/spresti/"+ klausimo_nr + "/" + request.params.id)  
	}
	}
});
app.get("/logout", function(req, res){
	res.redirect('http://localhost:3000/logout/')
})
app.get("/nebaigta/:email", function(req, res){
	var rez
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err){ return console.log(err)}
		rez=result[0].daroma
		testi()
	})
	function testi(){
	db.collection('pamoka').find({_id: ObjectId(rez)}).toArray((err, result) => {
    if (err){ return console.log(err)}
		sendSuccessResponse(res, result)
	})
	}
})
app.get("/testi/:email", function(req, res){
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err){ return console.log(err)}
	sendSuccessResponse(res, result[0].kl)
	})

})
app.get("/neisprendziamos/:email", function(req, res){
	console.log('esu')
	var rezas
	var galutinis = []
	var id
	db.collection('users').find({"kieno": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)
	rezas=result
	if (rezas.length!=0){
	taip()
	}
	else{
		sendSuccessResponse(res, 'taip')
	}
	})
	function taip()
	{
		if(rezas.length > 0)
		{		var laikinas=rezas[0].daroma
			db.collection('pamoka').find({_id: ObjectId(laikinas)}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
		}
		else
		{
			sendSuccessResponse(res, 'taip')
		}
	}
})
app.get("/geriausia/:email", function(req, res){
	var rezas
	db.collection('pamoka').find({"emailas": req.params.email}).sort({"kartu": -1}).toArray((err, result) => {
    if (err) return console.log(err)
	rezas=result
	siusti()
	})
	function siusti()
	{
		if (rezas.length == 0)
		{
			sendSuccessResponse(res, 'nera')
		}
		else
		{
			var tarp = rezas[0]
			sendSuccessResponse(res, tarp)
		}
	}
})

app.listen(8003, function () {
  console.log('Linstening on 8003 port!')
})


