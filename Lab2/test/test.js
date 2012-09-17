var should = require("should");
var request = require("superagent");
var assert = require("assert");

var index = require("../lib-coverage/index.js");

var port = 8888;
var endpoint = "http://localhost: " + port;

describe("Server", function() {

	describe("GET /start", function() {
		it("Hello Start", function(done) {
			request(endpoint + "/start").end(function(res) {
				assert(res.text, "Hello Start");
				done();
			});
		});
	});

	describe("GET /save?text=hejhjejeeje22222", function() {
		it("Your text: hejhjejeeje22222 was saved to the database.", function(done) {
			request(endpoint + "GET /save?text=hejhjejeeje22222").end(function(res) {
				assert(res.text, "GET /save?text=hejhjejeeje22222");
				done();
			});
		});
	});

	describe("GET /flag?id=5050b700677f1c7521000001", function() {
		it("The id 5050b700677f1c7521000001 is updated.", function(done) {
			request(endpoint + "GET /flag?id=5050b700677f1c7521000001").end(function(res) {
				assert(res.text, "GET /flag?id=5050b700677f1c7521000001");
				done();
			});
		});
	});

	describe("GET /getall", function() {
		it("JSON values returned. Check your console.", function(done) {
			request(endpoint + "GET /getall").end(function(res) {
				assert(res.text, "GET /getall");
				done();
			});
		});
	});

});