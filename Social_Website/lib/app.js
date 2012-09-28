var express = require("express");
var app = express();

var swig = require("swig");
var cons = require("consolidate");
var http = require("http");
var path = require("path");
var VIEWS_DIR = __dirname + "/../views/";

var db = require("./db");
var ol = require("./helpers/output_logger");

swig.init({
	root: VIEWS_DIR,
	allowErrors: true
});

app.engine("html", cons.swig);

app.configure(function() {
	app.set("port", process.env.PORT || 3000);
	app.set("views", VIEWS_DIR);
	app.set("view enginge", "html");
	app.set("view options", {layout: false});
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// Enable sessions
	app.use(express.cookieParser());
	app.use(express.session({ secret: "1ec9b448", key: "sid", cookie: {maxAge: 60000 * 6000}}));

	app.use(app.router);
	app.use("/style", express.static(__dirname + "/../css"));
	app.use("/javascript", express.static(__dirname + "/../js"));
});

app.configure("development", function() {
	app.use(express.errorHandler());
});

var getSessionStatus = function(req, callback) {
	if (req.session.email)
		var setSession = true;
	else
		var setSession = false;

	return setSession;
}


var getFriends = function(friends, callback) {
	// loop through req (change name), for each id call db.getUser(JSON), add to an array and return the array
	// Need to make this asynchronous!
	var friendsArray = new Array();

	for (var i = 0; i < friends.length; i++) {
		db.getUser({"_id": friends[i]}, function(callb, result) {
			friendsArray.push(result);

			if (i == friends.length)
				callback(friendsArray);
		});
	}
}

app.get("/", function(req, res) {
	res.render(VIEWS_DIR + "index.html", {session: getSessionStatus(req)});
});

app.get("/register", function(req, res) {
	res.render(VIEWS_DIR + "register.html", {session: getSessionStatus(req)});
});

app.post("/save", function(req, res) {
	db.registerUser(req.body, function(callback) {
		if (callback)
			res.render(VIEWS_DIR + "temp.html", {});
	});
});

app.get("/login", function(req, res) {
	if (req.query.unsuccessful)
		res.render(VIEWS_DIR + "login_unsuccessful.html", {session: getSessionStatus(req)});
	else if (req.session.email)
		// When the server restarts the session dissapears. Duh...
		res.redirect("/profile");
	else
		res.render(VIEWS_DIR + "login.html", {session: getSessionStatus(req)});
});

app.post("/login/get", function(req, res) {
	db.getUser(req.body, function(callback, result) {
		if (callback) {
			req.session.firstname = result.firstname;
			req.session.email = result.email;
			req.session.userId = result._id;
			req.session.save();
			// This probably work but I can't get this data from /profile
			// How do I do that?!
//			res.send(result);
			res.redirect("/profile");
		}
		else
			res.redirect("/login?unsuccessful=true");
	});
});

app.get("/logout", function(req, res) {
	req.session.destroy();
	res.redirect("/");
});

app.get("/profile", function(req, res) {
	// Check that the session-email really exist. Or is this maybe to advanced for this course?
	
	if (req.query.profileId) {
		db.getUser({"_id": req.query.profileId}, function(callback, result) {
			res.render(VIEWS_DIR + "profile.html", {session: getSessionStatus(req), userInfo: result, sessionEmail: req.session.email});
		});
	}
	else if (req.session.userId) {
		db.getUser({"_id": req.session.userId}, function(callback, result) {
			res.render(VIEWS_DIR + "profile.html", {session: getSessionStatus(req), userInfo: result, sessionEmail: req.session.email});
		});
	}
	else
		res.redirect("/login?unsuccessful=true");
});

/*
 * This is a much sweeter solution then with querys. Find out how to use this!
app.get("/profile/:id", function(req, res) {
	if (req.params["id"]) {
		db.getUser({"_id": req.params["id"]}, function(callback, result) {
			res.render(VIEWS_DIR + "profile.html", {session: getSessionStatus(req), userInfo: result});
		});
	}
});
*/

app.get("/friends", function(req, res) {
	db.getUserFriends(req.session.userId, function(callback, result) {
		getFriends(result, function(returnValue) {
			res.render(VIEWS_DIR + "friends.html", {session: getSessionStatus(req), friends: returnValue});
		});
	});
});

app.get("/addfriend", function(req, res) {
	db.addUserFriend({"_id": req.session.usoerId, "friendId": req.query.friendId}, function(callback, result) {
		if (callback)
			res.redirect("/friends");
	});
});

app.post("/search", function(req, res) {
	db.search(req.body["search"], function(callback, result) {
		res.render(VIEWS_DIR + "search.html", {session: getSessionStatus(req), searchResult: result, searchResultTotal: result.length});
	});
});

app.post("/wallpost", function(req, res) {
	
	redirect("/profile");
});

app.get("/temp", function(req, res) {
	res.render(VIEWS_DIR + "temp.html", {});
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});