"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('auth.wsdl', 'utf8');
var useris = [{"email":"tevas@padre.lt", "password":"mama"}];

var service = {
	AuthService : {
		authPort : {
			save: function(args){
				var isTrue = false;
			if(args["email"] == useris[0]["email"] && args["password"] == useris[0]["password"])
				{
					isTrue = true;
						
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

