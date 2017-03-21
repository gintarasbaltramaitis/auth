"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('auth.wsdl', 'utf8');
var useris = [{"email":"as@as.lt", "password":"mama"}, {"email":"tevas@padre.lt", "password":"mama"}];
var i = 0

var service = {
	AuthService : {
		authPort : {
			save: function(args){
				var isTrue = false;
				for(i=0; i<useris.length; i++){
			if(args["email"] == useris[i]["email"] && args["password"] == useris[i]["password"])
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



