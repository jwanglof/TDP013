var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/login"] = requestHandlers.login;
handle["/register"] = requestHandlers.register;
handle["/profile"] = requestHandlers.profile;
handle["/friends"] = requestHandlers.friends;
handle["/search"] = requestHandlers.search;
handle["/addFriend"] = requestHandlers.addFriend;

server.startServer(router.route, handle);