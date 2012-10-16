var should = require("should");
var request = require("superagent");
var assert = require("assert");

var index = require("../lib-coverage/index.js");

var port = 8888;
var endpoint = "http://localhost:" + port;

describe("Server", function() {

	/*
	 * Test 400 errors
	 */
	describe("Login a user without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/login").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Register a user without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/register").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Get profile data without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/profile").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Get search data without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/search").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Create a new friendship without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/addFriend").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("See if two users are friends without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/checkFriendship").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Get an array with a user's friends without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/friends").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Get an array with a user's wallposts without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/getWall").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});

	describe("Write on a user's wall without any parameters", function() {
		it("Should return a 400 error since no data is being sent", function(done) {
			request(endpoint + "/writeWall").end(function(res) {
				res.should.have.status(400);
				done();
			});
		});
	});



	/*
	 * Test 200
	 */
	describe("Register a user", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/register").type("form").send({firstname: "Test", surname: "User", email: "test@user.com", password: "asdasd", password_repeat: "asdasd"}).end(function(res) {
				res.should.have.status(200);
			});

/*			request.post(endpoint + "/register").type("form").send({firstname: "Test2", surname: "User2", email: "test2@user2.com", password: "asdasd", password_repeat: "asdasd"}).end(function(res2) {
				res2.should.have.status(200);
			});*/

			done();
		});
	});
	
	var newUserInfo = "";
	describe("Log in a user", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/login").type("form").send({email: "test@user.com", password: "asdasd"}).end(function(res) {
				newUserInfo = res.body;
				res.should.have.status(200);
				done();
			});
		});
	});

	var newUserInfo2 = "";
	describe("Log in a user2", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/login").type("form").send({email: "test2@user2.com", password: "asdasd"}).end(function(res) {
				newUserInfo2 = res.body;
				res.should.have.status(200);
				done();
			});
		});
	});
	
	describe("Fetch a user's profile", function() {
		console.log(newUserInfo);
		it("Should return 200", function(done) {
			request.post(endpoint + "/profile").type("form").send({_id: newUserInfo._id}).end(function(res) {
				res.should.have.status(200);
				done();
			});
		});
	});

	describe("Search for a user", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/search").type("form").send({email: "test@user.com"}).end(function(res) {
				res.should.have.status(200);
				done();
			});
		});
	});

	describe("Add a new friend", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/addFriend").type("form").send({userId: newUserInfo._id, friendId: newUserInfo2._id}).end(function(res) {
				res.should.have.status(200);
				done();
			});
		});
	});

	/*
	 * Test 404
	 *
	describe("Show an 404 error", function() {
		it("Should return a 404 error since the page doesn't exist", function(done) {
			request(endpoint + "/unknownPage").end(function(res) {
				res.should.have.status(404);
				done();
			});
		});
	});


/*
	describe("See a profile", function() {
		it("Should return 200", function(done) {
			request.post(endpoint + "/profile").type("form").send({_id: "test@user.com"}).end(function(res) {
				res.should.have.status(200);
				done();
			});
		});
	});

	
	


/*	describe("Get 400 Bad Request from /save", function() {
		it("should return a 400 error since the user hasn't specified ?text=", function(done) {
			request(endpoint + "/save").end(function(res) {
				res.should.have.status(400);
				res.text.should.equal("400 Bad Request <br />You have to send a text to be inserted into the DB. <br />I.e. save?text=Someawesometextstring");
				done();
			});
		});
	});

	describe("POST", function() {
		it("should return a 405 error", function(done) {
			request.post(endpoint + "/getall").send( {test: "test"}).end(function(res) {
				res.should.have.status(405);
				done();
			});
		});
	});



	 * Test 404 Not Found

	 */

});