var app = require("./app");

app.get("/", function(req, res) {
	res.render(VIEWS_DIR + "index.html", {session: sess.getSessionStatus(req)});
});

app.get("/home", function(req, res) {
	res.render(VIEWS_DIR + "index.html", {session: sess.getSessionStatus(req)});
});

app.get("/register", function(req, res) {
	res.render(VIEWS_DIR + "register.html", {session: sess.getSessionStatus(req)});
});


app.get("/login", function(req, res) {
	if (req.query.unsuccessful)
		res.render(VIEWS_DIR + "login_unsuccessful.html", {session: sess.getSessionStatus(req)});
	else if (req.session.userId)
		// When the server restarts the session dissapears. Duh...
		res.redirect("/profile");
	else
		res.render(VIEWS_DIR + "login.html", {session: sess.getSessionStatus(req)});
});


app.get("/logout", function(req, res) {
	req.session.destroy();
	res.redirect("/");
});

app.get("/profile", function(req, res) {
	// Check that the session-email really exist. Or is this maybe to advanced for this course?

	if (req.query.userId || req.session.userId) {
		var getId;
		if (req.query.userId)
			getId = req.query.userId;
		else if (req.session.userId)
			getId = req.session.userId;

		var friendship;
		if (req.query.userId) {
			friends.checkFriendship(req.session.userId, req.query.userId, function(returnedFriendship) {
				friendship = returnedFriendship;
			});
		}

		db.getUser({_id: getId}, function(callback, result) {
			wallposts.getWallPosts(getId, function(returnedWallPosts) {
				res.render(VIEWS_DIR + "profile.html", {session: sess.getSessionStatus(req), userInfo: result, wallPosts: returnedWallPosts, userId: req.session.userId, friendship: friendship});
			});
		});
	}
	else
		res.redirect("/login?unsuccessful=true");
});


app.get("/friends", function(req, res) {
	db.getUserFriends(req.session.userId, function(callback, result) {
		friends.getFriends(result, function(returnValue) {
			res.render(VIEWS_DIR + "friends.html", {session: sess.getSessionStatus(req), friends: returnValue});
		});
	});
});

app.get("/addfriend", function(req, res) {
	db.addUserFriend({_id: req.session.userId, friendId: req.query.friendId}, function(callback, result) {
		if (callback)
			res.redirect("/friends");
	});
});



app.get("/temp", function(req, res) {
	res.render(VIEWS_DIR + "temp.html", {});
});
