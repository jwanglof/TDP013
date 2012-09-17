var should = require('should');
var request = require('superagent');
var assert = require('assert');

var index = require('../lib-coverage/main.js');

var port = 8888;
var endpoint = "http://localhost:" + port;

describe('Server', function() {
	
	describe('GET /hello', function() {

		it('should return Hello', function(done) {
			
			request(endpoint + "/hello").end(function(res) {
				
				assert(res.text, "Hello");
				done();

			});
			
		});

	});

	describe("GET /goodbye", function() {

		it('should return Goodbye', function(done) {
			
			request(endpoint + "/goodbye").end(function(res) {
				
				assert(res.text, "Goodbye");
				done();
				
			});
			
		});

	});


	describe("GET /undefined", function() {

		it('should return status 404', function(done) {
			
			request(endpoint + "/undefined").end(function(res) {

				assert(res.status, 404);
				done();

			});

		});

	});

});