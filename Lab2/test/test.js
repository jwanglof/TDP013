var should = require("should");
var request = require("superagent");
var assert = require("assert");

var index = require("../lib-coverage/index.js");

var port = 8888;
var endpoint = "http://localhost:" + port;

describe("Server", function() {

	/*
	 * Test / and /start
	 */
	describe("Show the startpage", function() {
		it("writes Hello Start", function(done) {
			request(endpoint + "/start").end(function(res) {
				res.should.have.status(200);
				res.text.should.equal("Hello Start");
				done();
			});
		});
	});

	describe("Show the startpage", function() {
		it("writes Hello Start", function(done) {
			request(endpoint + "/").end(function(res) {
				res.should.have.status(200);
				res.text.should.equal("Hello Start");
				done();
			});
		});
	});
	/*
	 * End of Test / and /start
	 */

	/*
	 * Test /save
	 */
	describe("Get 200 from /save", function() {
		it("should return a 200 OK", function(done) {
			request(endpoint + "/save?text=Thisstringshouldbeadded").end(function(res) {
				res.should.have.status(200);
				res.text.should.equal("Your text: Thisstringshouldbeadded was saved to the database.");
				done();
			});
		});
	});

	describe("Get 400 Bad Request from /save", function() {
		it("should return a 400 error since the user hasn't specified ?text=", function(done) {
			request(endpoint + "/save").end(function(res) {
				res.should.have.status(400);
				res.text.should.equal("400 Bad Request <br />You have to send a text to be inserted into the DB. <br />I.e. save?text=Someawesometextstring");
				done();
			});
		});
	});

	describe("Get 400 Bad Request from /save", function() {
		it("should return a 400 error since the user doesn't have a text after ?text=", function(done) {
			request(endpoint + "/save?text=").end(function(res) {
				res.should.have.status(400);
				res.text.should.equal("400 Bad Request <br />You have to send a text to be inserted into the DB. <br />I.e. save?text=Someawesometextstring");
				done();
			});
		});
	});

	describe("Get 400 Bad Request from /save", function() {
		it("should return a 400 error since the text is too long ?text=", function(done) {
			request(endpoint + "/save?text=12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890").end(function(res) {
				res.should.have.status(400);
				res.text.should.equal("400 Bad Request <br />Your text is too large. Please shorten it to 140 characters or less. <br />I.e. save?text=Someawesometextstring");
				done();
			});
		});
	});

	/*
	 * End of Test /save
	 */

	/*
	 * Test /flag
	 */
	describe("Get 200 from /flag", function() {
		it("should return a 200 OK", function(done) {
			request(endpoint + "/flag?id=5050b700677f1c7521000001").end(function(res) {
				res.should.have.status(200);
				res.text.should.equal("The id 5050b700677f1c7521000001 is updated.");
				done();
			});
		});
	});

	describe("Get 400 from /flag", function() {
		it("should return a 400 error since the id 
	/*
	 * End of Test /flag
	 */

	/* 
	 * Test 404 Not Found
	 */
	describe("Show an 404 error", function() {
		it("should return a 404 error since the page doesn't exist", function(done) {
			request(endpoint + "/unknownPage").end(function(res) {
				res.should.have.status(404);
				done();
			});
		});
	});
	/* 
	 * End of Test 404 Not Found
	 */
});