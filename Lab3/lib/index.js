var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/save"] = requestHandlers.save;
handle["/flag"] = requestHandlers.flag;
handle["/getall"] = requestHandlers.getall;

server.startServer(router.route, handle);