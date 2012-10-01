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
	if (req.session.userId)
		var setSession = true;
	else
		var setSession = false;


	return setSession;
}

var getFriends = function(friends, callback) {
	var friendsArray = new Array();

	if (friends != undefined) {
		for (var i = 0; i < friends.length; i++) {
			db.getUser({"_id": friends[i]}, function(callb, result) {
				friendsArray.push(result);

				if (i == friends.length)
					callback(friendsArray);
			});
		}
	}
	else
		callback();
}

var checkFriendship = function(user, friend, callback) {
	db.checkFriendship({userId: user, friendId: friend}, function(good) {
		callback(good);
	});
}

var getWallPosts = function(userId, callback) {
	var wallpostArray = new Array();
	db.getWallText({to_id: userId}, function(good, result) {
		if (good) {
			for (var i = 0; i < result.length; i++) {
				var res_wallpost = result[i]["wallpost"];

				db.getUser({_id: result[i]["from_id"]}, function(err, user_result) {
					wallpostArray.push({wallpost: res_wallpost, from_user: user_result.firstname, from_id: user_result._id});
				});
			}
			callback(wallpostArray);
		}
		else
			callback();
	});
}

app.get("/", function(req, res) {
	res.render(VIEWS_DIR + "index.html", {session: getSessionStatus(req)});
});

app.get("/home", function(req, res) {
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
	else if (req.session.userId)
		// When the server restarts the session dissapears. Duh...
		res.redirect("/profile");
	else
		res.render(VIEWS_DIR + "login.html", {session: getSessionStatus(req)});
});

app.post("/login/get", function(req, res) {
	db.getUser(req.body, function(callback, result) {
		if (callback) {
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

	if (req.query.userId || req.session.userId) {
		if (req.query.userId)
			var getId = req.query.userId;
		else if (req.session.userId)
			var getId = req.session.userId;

		var friendship;
		if (req.query.userId) {
			checkFriendship(req.session.userId, req.query.userId, function(returnedFriendship) {
				friendship = returnedFriendship;
			});
		}

		db.getUser({_id: getId}, function(callback, result) {
			getWallPosts(getId, function(returnedWallPosts) {
				res.render(VIEWS_DIR + "profile.html", {session: getSessionStatus(req), userInfo: result, wallPosts: returnedWallPosts, userId: req.session.userId, friendship: friendship});
			});
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
	db.addUserFriend({_id: req.session.userId, friendId: req.query.friendId}, function(callback, result) {
		if (callback)
			res.redirect("/friends");
	});
});

app.post("/search", function(req, res) {
	db.search(req.body["search"], function(callback, result) {
		if (!callback) {
			result = [];
		}
		res.render(VIEWS_DIR + "search.html", {session: getSessionStatus(req), searchResult: result, searchResultTotal: result.length});
	});
});

app.post("/wallpost", function(req, res) {
//	console.log(req.body + "  --  " + req.session.userId + " -- " + req.body.hidden_userid);
	db.addWallText({wallpost: req.body["wallpost"], to_id: req.body.hidden_userid, from_id: req.session.userId}, function(callback) {
		if (callback)
			res.redirect("/profile?userId=" + req.body.hidden_userid);
		else
			res.redirect("/temp");
	});
});

app.get("/temp", function(req, res) {
	res.render(VIEWS_DIR + "temp.html", {});
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});