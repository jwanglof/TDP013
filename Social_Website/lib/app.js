var express = require("express");
var swig = require("swig");
var cons = require("consolidate");
var http = require("http");
var path = require("path");
var VIEWS_DIR = __dirname + "/../views/";

console.log(VIEWS_DIR);

swig.init({
	root: VIEWS_DIR,
	allowErrors: true
});

var app = express();
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
	app.use(app.router);
	//app.use(express.static(path.join(__dirname, "public")));
	app.use("/style", express.static(__dirname + "/../css"));
	app.use("/javascript", express.static(__dirname + "/../js"));
});

app.configure("development", function() {
	app.use(express.errorHandler());
});

app.get("/", function(req, res) {
	res.render(VIEWS_DIR + "index.html", {foo: "bar"});
});

app.get("/register", function(req, res) {
	res.render(VIEWS_DIR + "register.html", {});
});

app.get("/save", function(req, res) {
	console.log(req.body);
	res.sendfile(VIEWS_DIR + "save.html");
});

app.get("/login", function(req, res) {
	res.render(VIEWS_DIR + "login.html", {});
});

app.get("/profile", function(req, res) {
	res.render(VIEWS_DIR + "temp.html", {});
});

http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});