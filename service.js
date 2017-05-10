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


var i = 0
var service = {
	AuthService : {
		authPort : {
			save: function(args){
				var isTrue = false;
				for(i=0; i<args.user.user.length; i++)
				{
					if(args["email"] == args.user.user[i] && args["password"] == args.passUser.passUser[i])
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



