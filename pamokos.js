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
app.put('/slapt/:email/', (req, res) => {
	db.collection('users')
	.findOneAndUpdate({"emailas": req.params.email}, {
    $set: {
      pass: req.body.pass,
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
app.put('/vard/:email', (req, res) => {
			db.collection('users')
		.findOneAndUpdate({"emailas": req.params.email}, {
    $set: {
      vardas: req.body.vardas
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
  })
  db.collection('users').updateMany({"daroma": req.params.id}, {$unset: {"daroma": 1, "kl": 1, "kieno": 1}})
		sendSuccessResponse(res, 'taip')
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
app.put('/pamoka/atnaujinti/:id', (req, res) => {	
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
    $set: {
      tema: req.body.tema,
	  aprasymas: req.body.aprasymas,
	  kalba: req.body.kalba,
	  lygis: req.body.lygis
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
app.post('/pamoka/prideti/:email', (req, res) => {
	db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas: req.body.vard,
		emailas:req.params.email,
		tema:req.body.tema,
		aprasymas:req.body.aprasymas,
		kalba:req.body.kalba,
		lygis:req.body.lygis,
		publikuota: "false",
		sukurta: (new Date()).toISOString().slice(0,10),
		kartu: "0"
		
		
		}
  db.collection('pamoka').save(duomenys , (err, result) => {
    if (err) return console.log(err)
		db.collection('pamoka').find({vardas: 
req.body.vard,emailas:req.params.email,tema:req.body.tema,aprasymas:req.body.aprasymas,kalba:req.body.kalba,lygis:req.body.lygis}).toArray((err, result) => {
		if (err) return console.log(err);
		sendSuccessResponse(res, result)
		})
   
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
		vardas:"Klausimas",
		uzduotis:"Uzduotis",
		atsakymas:"Atsakymas",
		skaidre:"Skaidre",
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
	var i
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
	toliau()
})
	function toliau()
	{
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas:"Klausimas",
		uzduotis:"Aprasymas",
		atsakymas:"Atsakymas",
		skaidre: "Skaidre",
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
app.put('/atnaujinti/klausimas/:kid/:id', (req, res) => {
  db.collection('klausimas')
  .findOneAndUpdate({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}, {
    $set: {
      vardas: req.body.vardas,
	  uzduotis: req.body.uzduotis,
	  atsakymas: req.body.atsakymas,
	  skaidre: req.body.skaidre,
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    sendSuccessResponse(res, result)
  })
})
app.get('/filtras', (req, res) => {



		if(req.body.kalba == 'Visi' && req.body.lygis == 'Visi' && req.body.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true'}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
		}
		else if(req.body.kalba != 'Visi' && req.body.lygis == 'Visi' && req.body.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', kalba: req.body.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.body.kalba == 'Visi' && req.body.lygis != 'Visi' && req.body.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', lygis: req.body.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.body.kalba == 'Visi' && req.body.lygis == 'Visi' && req.body.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.body.destytojas}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.body.kalba != 'Visi' && req.body.lygis != 'Visi' && req.body.destytojas == 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', kalba: req.body.kalba, lygis: req.body.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.body.kalba != 'Visi' && req.body.lygis == 'Visi' && req.body.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.body.destytojas, kalba: req.body.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else if(req.body.kalba == 'Visi' && req.body.lygis != 'Visi' && req.body.destytojas != 'Visi')
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.body.destytojas, lygis: req.body.lygis}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
			
		}
		else
		{
			db.collection('pamoka').find({publikuota: 'true', vardas: req.body.destytojas, lygis: req.body.lygis, kalba: req.body.kalba}).toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)
			})
		}
	
	
})


app.get('/pradeti/:id', (req, res) => {
	var rez
	var kartai
	db.collection('users').find({"emailas": req.body.email}).toArray((err, result) => {
    if (err){ return console.log(err)}
		rez=result
		toliau()
	})
	function toliau()
	{
		
		if (rez[0].daroma== undefined || rez[0] == 'nera')
		{
	    db.collection('pamoka').find({"_id": ObjectId(req.params.id)}).toArray((err, result) =>{
			kartai=parseInt(result[0].kartu)+1
			update()

		});
		function update(){
		db.collection('users')
		.findOneAndUpdate({"emailas": req.body.email}, {
		$set: {
		daroma: req.params.id,
		kl: 1,
		kieno: req.body.email2
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
app.put("/tikrinti/:kid/:id", function(req, res){
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}).toArray((err, result) => {
    if (err){ return console.log(err)}
		rez=result[0].atsakymas
		tikrinti()
	})
	function tikrinti()
	{	var tarp
		if(rez == req.body.atsakymas)
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
				
				db.collection('users').update({"emailas": req.body.email}, {$unset: {"daroma": 1}})
				db.collection('users').update({"emailas": req.body.email}, {$unset: {"kl": 1}})
				db.collection('users').update({"emailas": req.body.email}, {$unset: {"kieno": 1}})
				sendSuccessResponse(res, 'sveikinu')
			}
			else
			{
				var du =parseInt(req.params.kid) + 1
				  db.collection('users')
				.findOneAndUpdate({"emailas": req.body.email}, {
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
	db.collection('pamoka').find({"emailas": req.params.email}).sort({"kartu": 1}).toArray((err, result) => {
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
app.get("/vartotojai", function(req, res){
db.collection('users').find().toArray((err, result) => {
			if (err) return console.log(err)
			sendSuccessResponse(res, result)

    });
})
app.get("/daromaPam/:email", function(req, res){
	db.collection('users').find({"emailas": req.params.email}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
})
app.get("/kurejas/:id", function(req, res){
	db.collection('pamoka').find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
})
app.get("/kiek/:id", function(req, res){
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err) return console.log(err)
		sendSuccessResponse(res, result)
	})
})
app.put("/keistiPamokosVarda", function(req, res){
	db.collection('pamoka').updateMany({"emailas": req.body.email}, {$set: {"vardas": req.body.vardas}})
		sendSuccessResponse(res, 'tak')
})
app.put('/naujaSkaidre/:kid/:id', (req, res) => {
	var skaidrute
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid) }).toArray((err, result) => {
    if (err) return console.log(err)
	skaidrute=result[0].skaidre
db.collection('klausimas')
  .findOneAndUpdate({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}, {
    $set: {
      skaidre: skaidrute + ',Nauja skaidre'
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
		sendSuccessResponse(res, result)
  })
	
  })


})
app.put('/istrintiSkaidre/:kid/:id/:skai', (req, res) => {
	db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}).toArray((err, result) => {
    if (err) return console.log(err)
		var skaidres = result[0].skaidre
		var resas = skaidres.split(",")
		console.log(resas)
		if (resas.length <= 1)
		{
			sendSuccessResponse(res, '1 skaidre')
		}
		else
		{
			resas.splice(req.params.skai, 1)
			
			db.collection('klausimas')
  .findOneAndUpdate({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}, {
    $set: {
      skaidre: resas.toString()
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
		sendSuccessResponse(res, result)
  })
		}
	})


})
app.delete('/istrintiKlausima/:kid/:id', (req, res) => {
  if(req.params.kid == 1)
  {
	 db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err){ return console.log(err)}
		if (result.length == 1)
		{
			sendSuccessResponse(res, 'paskutinis klausimas')
		}
		else
		{
			console.log('cia')
			trintiPam()
		}
	})
  }
  else
  {
	  trintiPam()
  }
  function trintiPam()
  {
	  var rezas
	  var i = parseInt(req.params.kid)
	  db.collection('klausimas').findOneAndDelete({"pamokos_id": ObjectId(req.params.id), "kl_id": parseInt(req.params.kid)}, (err, result) => {
    if (err) return console.log(err)
	

db.collection('klausimas').find({"pamokos_id": ObjectId(req.params.id)}).toArray((err, result) => {
    if (err){ return console.log(err)}
		rezas=result.length
		console.log(rezas)

  for( var j = parseInt(req.params.kid); rezas>=j; j++){
	  
	db.collection('klausimas').update({"pamokos_id": ObjectId(req.params.id), "kl_id": { $gt: j} }, { $set: { kl_id: j }} )
}
	sendSuccessResponse(res, 'tak')
})
})
}
})


app.listen(8003, function () {
  console.log('Linstening on 8003 port!')
})


