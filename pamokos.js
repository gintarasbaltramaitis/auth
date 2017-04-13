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

app.get("/paskyra/:id", function(req, res){
	
	prisijunges=req.params.id
	db.collection('users').find({_id: ObjectId(prisijunges)}).toArray((err, result) => {
    if (err) return console.log(err)
	prisijunges=result[0].emailas
	vard = result[0].vardas
	res.redirect('/paskyra')
	})

	
	
	
});
function ifthis()
{
	if (prisijunges == null)
	{
		tiesa=false
	}
	else{
		tiesa=true
	}
}

app.get("/paskyra", function(req, res){
	ifthis()
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	db.collection('users').find({"emailas": prisijunges}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('paskyra.ejs', {reg: result})
	})
	}
})
app.get('/slaptazodis', function(req, res){
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	db.collection('users').find({"emailas": prisijunges}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
	
		siusti()
	})
	function siusti(){
    res.render('slaptazodis.ejs', {
			role: rez[0].rol,
			vard: rez[0].vardas,
			klaida:  zin,
			klaida2: zin2,
			pake: pak
	})
	pak=""
	zin=""
	zin2=""
	}
		
	}
});
app.put('/slaptazodiss', (req, res) => {
	pak=""
	zin=""
	zin2=""
	taip=true
  var senas=req.body.senas
  var naujas=req.body.naujas1
  var naujas2=req.body.naujas2
  db.collection('users').find({'emailas': prisijunges}).toArray((err, result) => {
    if (err) return console.log(err)
		if(result[0].pass != senas)
		{
			zin = 'Neteisingas senas slaptazodis'
			taip=false
			toliau()
		}
		else{
			toliau()
		}
		
	})
	function toliau(){
		if (naujas != naujas2)
		{
			zin2 = 'slaptazodziai nesutampa'
			taip = false;
			keiciam()
		}
		else
		{
			keiciam()
		}
	}
	function keiciam()
	{
		if(taip)
		{
			db.collection('users')
		.findOneAndUpdate({"emailas": prisijunges}, {
    $set: {
      pass: naujas,
	  pakeistas: new Date().toLocaleString()
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
	pak='Slaptažodis sėkmingai pakeistas'
    res.send(result)
	
  })
		
	
		}
		else{
			
		res.redirect("slaptazodis");
		console.log('siunciu duomenys')
		}
		
	}
  
})
app.get("/vardas", function(req, res){
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	db.collection('users').find({"emailas": prisijunges}).toArray((err, result) => {
    if (err) return console.log(err)
		rez=result
		siusti()
	})
	function siusti(){
    res.render('vardas.ejs', {
			role: rez[0].rol,
			vard: rez[0].vardas,
			klaida:  zin,
			pake: zin2
	})
	zin=""
	zin2=""
		}
	}
})
app.put('/vardass', (req, res) => {
	
	zin=""
	zin2=""
  var senas=req.body.vardas
  db.collection('users').find({"vardas": senas}).toArray((err, result) => {
    if (err) return console.log(err)
		if (result.length > 0){
			zin = 'Toks vardas jau užimtas'
			res.redirect("/vardas")
		}
		else { darytii()}
  })
		
		function darytii(){
			db.collection('users')
		.findOneAndUpdate({"emailas": prisijunges}, {
    $set: {
      vardas: senas
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
	zin2='Vardas pakeistas'
    res.send(result)
	
  })
		
  
		}
})
app.get("/pamoka", function(req, res){
		if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
    res.render('prideti_pam.ejs', {
			zinute: zin,
			tema: tem,
			apra: ap
	})
	zin=""
		}
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
app.get("/redaguoti/klausimus/:kid:id", function(request, response){
		if(!tiesa){
		response.redirect('http://localhost:3000/login')
	}
	else{
	var masyvas
	var masyv
	db.collection('klausimas').find({"kl_id": parseInt(request.params.kid) , "pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
	masyvas=result
	console.log('cia dar veikia')  
	siu()
  })
  function siu(){
  db.collection('klausimas').find({"pamokos_id": ObjectId(request.params.id) }).sort({"kl_id": 1}).toArray((err, result) => {
    if (err) return console.log(err)
	masyv=result
	console.log('cia dar veikia')
    siunciam()
  })
  }
  function siunciam(){
	console.log(masyv)
	console.log('|||||||||||||||||||')
  response.render('klausimas.ejs', {klausimas: masyvas, kiekis: masyv, id: request.params.id})
  }
		}
})
app.put('/atnaujinti', (req, res) => {
	console.log("as cia")
	if(req.body.tema == "" || req.body.aprasymas == ""){
		console.log('tusti laukai')
		res.render('atnaujinti.ejs', {
		zinute: "Palikti tusti laukai"		
		})
	}
	else{
		
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(rez[0]._id)}, {
    $set: {
      tema: req.body.tema,
	  aprasymas: req.body.aprasymas
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err){ return res.send(err)}
  })

 
	}
})	
app.get('/manopamokos', (req, res) => {
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	var pam
	var role
  db.collection('pamoka').find({"emailas": prisijunges}).toArray((err, result) => {
    if (err) return console.log(err)
			pam=result
		testi()
		
  })
  function testi(){
  db.collection('users').find({"emailas": prisijunges}).toArray((err, resultas) => {
    if (err) return console.log(err)
		role=resultas[0].rol
	if (role != 2) {
		res.send('ne cia pateikei')
	}
	else{
		siusti()
	}
  })
  }
	function siusti(){
  res.render('pamokos.ejs', {pamoka: pam, rol: role})
	}
	}
})
app.post('/pamoka/prideti', (req, res) => {
	zin = ""
	tem = req.body.tema
	ap = req.body.aprasymas

	if(tem == "" || ap == "")
	{
		zin="Kažkur palikti tušti laukai"
		res.redirect("/pamoka")
	}
	else{
	db.collection('pamoka').find().toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas: vard,
		emailas:prisijunges,
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
	ieskoti()	
	
   
  })
})
function ieskoti(){
	db.collection('pamoka').find({vardas: vard,
		emailas:prisijunges,
		tema:req.body.tema,
		aprasymas:req.body.aprasymas,
		kalba:req.body.kalba,
		lygis:req.body.lygis}).toArray((err, result) => {
    if (err) return console.log(err)
		idas=result[0]._id
		redi()
		function redi(){
		res.redirect("/prideti/1klausima/" + idas)
		}
	})
	}
	}
 })
app.get("/klausimas/naujas/:kid:id", function(request, response){
	var masyvas
	var masyv
	db.collection('klausimas').find({"kl_id": parseInt(request.params.kid) , "pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
	masyvas=result
	console.log('cia dar veikia')  
	siu()
  })
  function siu(){
  db.collection('klausimas').find({"pamokos_id": ObjectId(request.params.id) }).sort({"kl_id": 1}).toArray((err, result) => {
    if (err) return console.log(err)
	masyv=result
    siunciam()
  })
  }
  function siunciam(){
  response.render('klausimas.ejs', {klausimas: masyvas, kiekis: masyv, id: request.params.id})
  }
});
app.get("/prideti/1klausima/:id", function(req, res){
	ilgis=1
	db.collection('klausimas').find({"pamokos_id": ObjectId(idas)}).toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas:"",
		uzduotis:"",
		atsakymas:"",
		skaidre:"",
		pamokos_id: ObjectId(idas),
		kl_id: ilgis
		
		
		}
  db.collection('klausimas').save(duomenys , (err, result) => {
    if (err) return console.log(err)
    res.redirect("/klausimas/naujas/" + ilgis + idas);
  })
})
});
app.post("/klausimas/naujas", function(req, res){
	ilgis=ilgis+1
	db.collection('klausimas').find({"pamokos_id": ObjectId(idas)}).toArray((err, result) => {
    if (err) return console.log(err)
	var duomenys = {
		vardas:req.body.vardas,
		uzduotis:req.body.uzduotis,
		atsakymas:req.body.atsakymas,
		skaidre:req.body.skaidre,
		pamokos_id: ObjectId(idas),
		kl_id: ilgis
		
		
		}
		
  db.collection('klausimas').save(duomenys , (err, result) => {
    if (err) return console.log(err)
    res.redirect("/klausimas/naujas/" + ilgis+ idas);
  })
})
});
app.put('/klausimas/pakeisti/:kid:id', (req, res) => {
  console.log(req.params.id + "cia")
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
    res.send(result)
  })
})
app.get('/pamokos', (req, res) => {
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
	var pam
	var role
	var pamo
	var ii=0
  db.collection('pamoka').find({"publikuota": "true"}).toArray((err, result) => {
    if (err) return console.log(err)
			pam=result
		console.log(pam)
		testi()
		
  })
  function testi(){
  db.collection('users').find({"emailas": prisijunges}).toArray((err, resultas) => {
    if (err) return console.log(err)
		role=resultas[0].rol
		siusti()
  })
  }
	function siusti(){
	console.log(role)
  res.render('pam.ejs', {pamoka: pam, rol: role})
	}
	}
})
app.put('/publikuoti', (req, res) => {
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
app.put('/nebepublikuoti', (req, res) => {
  var idas=req.body._id
  console.log(idas)
  db.collection('pamoka')
  .findOneAndUpdate({"_id": ObjectId(idas)}, {
    $set: {
      publikuota: "false"
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
	var idas=req.body._id
  db.collection('pamoka').findOneAndDelete({"_id": ObjectId(idas)}, (err, result) => {

    if (err) return console.log(err)
  })
  db.collection('klausimas').deleteMany({"pamokos_id": ObjectId(idas)}, (err, result) => {

    if (err) return console.log(err)
		res.send('istrinta')
  })
})
app.get('/pradeti/:id', (req, res) => {
	var kartu
	var rez
	if(!tiesa){
		res.redirect('http://localhost:3000/login')
	}
	else{
		db.collection('users').find({"emailas": prisijunges}).toArray((err, result) => {
    if (err){ return console.log(err)}
		console.log(result)
		rez=result[0].daroma
		pradeti()
		})
		function pradeti(){
		db.collection('users')
		.findOneAndUpdate({"emailas": prisijunges}, {
		$set: {
		daroma: req.params.id
		}
		}, {
		sort: {_id: -1},
		upsert: true
		}, (err, result) => {
		if (err) return res.send(err)
		})
		
		db.collection('pamoka').find({_id: ObjectId(req.params.id)}).toArray((err, result) => {
		if (err) return console.log(err)
		db()
		function db(){
		kartu=parseInt(result[0].kartu)+1
		console.log(kartu)
		ivedam()
		}
		})
		function ivedam(){
		db.collection('pamoka')
		.findOneAndUpdate({"_id": ObjectId(req.params.id)}, {
		$set: {
		kartu: kartu
		}
		}, {
		sort: {_id: -1},
		upsert: true
		}, (err, result) => {
		if (err) return res.send(err)
		})
		}
		}
			res.redirect("/spresti/1/"+req.params.id)
		}
		// baigiasi funcija
	
	
})
app.get("/spresti/:kid/:id", function(request, response){
	var masyvas
	var masyv
	db.collection('klausimas').find({"kl_id": parseInt(request.params.kid) , "pamokos_id": ObjectId(request.params.id) }).toArray((err, result) => {
    if (err) return console.log(err)
	masyvas=result
	console.log(masyvas)
	console.log('1')
	siu()
  })
  function siu(){
  db.collection('klausimas').find({"pamokos_id": ObjectId(request.params.id) }).sort({"kl_id": 1}).toArray((err, result) => {
    if (err) return console.log(err)
	masyv=result
    siunciam()
  })
  }
  function siunciam(){
	console.log(masyvas)
	console.log('2')
  response.render('spresti.ejs', {klausimas: masyvas, kl: request.params.kid, kiekis: masyv, id: request.params.id, zinute: zin})
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
		console.log(result)
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
		console.log('as cia')
		zin=""
		response.redirect("/spresti/"+ klausimo_nr + "/" + request.params.id)
		}
	}
	else{
		response.redirect("/spresti/"+ klausimo_nr + "/" + request.params.id)  
	}
	}
});

app.listen(8003, function () {
  console.log('Linstening on 8003 port!')
})


