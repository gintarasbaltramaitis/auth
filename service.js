"use strict";
const MongoClient = require('mongodb').MongoClient
var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('auth.wsdl', 'utf8');
var express = require('express')
var session = require('express-session')
var bodyparser = require('body-parser')
var app = express()
var db
var user
 MongoClient.connect('mongodb://viko:viko@ds133340.mlab.com:33340/viko',function(err,database){
    if(err)
    {
        console.log(err);
    }
    else
    {
		db=database
       db.collection('users').find().toArray((err, result) => {
    if (err) return console.log(err)
    user=result
	testi()
	 
  })
	}

})

function testi(){
var i = 0
var service = {
	AuthService : {
		authPort : {
			save: function(args){
				var isTrue = false;
				for(i=0; i<user.length; i++){
					
			if(args["email"] == user[i].emailas && args["password"] == user[i].pass)
				{					
					isTrue = true;						
				}
				}	
				return{
				Login: isTrue	}
			}
					
		}
}};

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/imam', service, xml);
}


