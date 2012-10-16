/*
 * Output logger is a help tool that makes the outputs in the console better, and makes it easier to shut off the logging
 * Takes 2 arguments: What text to be shown, and which file the text originates from
 */
var ol = require("./helpers/output_logger");
var filename = "db.js";

var mongodb = require("mongodb");
var mongo_server = new mongodb.Server("localhost", 27017, {auto_reconnect: true, safe: false});
var mongo_db = new mongodb.Db("tdp013project1", mongo_server);

// Use this DB for Mocha-tests!
//var mongo_db = new mongodb.Db("tdp013projectMocha", mongo_server);

/*
 *  The DB-connection will always be open
 */
mongo_db.open(function(err, db) {
	if (!err) {
		ol.logger("DB connection OPEN", filename);

		/*
		 * registerUser
		 * There can be several users with the same e-mail now. Perhaps fix this?
		 */
		var registerUser = function(json_data, callback) {
			ol.logger("registerUser() called", filename);

			if (mongo_db._state == "connected") {
				mongo_db.collection("users", function(err, collection) {
					collection.insert(
						json_data,
						{
							safe: true
						},
						function(err, res) {
							if (!err) {
								ol.logger("User added to DB", filename);
								callback(true);
							}
							else {
								ol.logger("ERROR: User not added to DB!", filename);
								callback(false);
							}
						}
					);
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * getUser
		 * Returns one user's information
		 */
		var getUser = function(json_data, callback) {
			ol.logger("getUser() called", filename);

			if (mongo_db._state == "connected") {
				if (json_data["_id"])
					json_data["_id"] = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["_id"]);
				
				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.findOne(
							json_data,
							function(err, docs) {
								if (docs != null && !err) {
									ol.logger("Fetched a user", filename);
									callback(true, docs);
								}
								else {
									ol.logger("ERROR: Can not fetch a user", filename);
									callback(false);
								}
							}
						);
					}
					else {
						ol.logger("ERROR:", filename);
						callback(false);
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * getUserFriends()
		 * Returns an array with friend IDs
		 */
		var getUserFriends = function(json_data, callback) {
			ol.logger("getUserFriends() called", filename);

			if (mongo_db._state == "connected") {
				if (json_data["_id"])
					json_data["_id"] = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["_id"]);

				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.findOne(
							json_data,
							function(err, docs) {
								if (docs.friends != undefined) {
									callback(true, docs.friends);
								}
								else
									callback(false);
							}
						);
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * search()
		 * Returns an array with the matched users
		 */
		var search = function(json_data, callback) {
			ol.logger("search() called", filename);

			if (mongo_db._state == "connected") {
				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.find(
							json_data
						).toArray(function(err, docs) {
							if (docs != [] && docs.length > 0) {
								callback(true, docs);
							}
							else
								callback(false);
						});
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * addUserFriend()
		 * Doesn't check for any error or anything, pretty unsafe.
		 */
		var addUserFriend = function(json_data, callback) {
			ol.logger("addUserFriend() called", filename);

			if (mongo_db._state == "connected") {
				var userId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["_id"]);
				var friendId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["friendId"]);
				
				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						// Add the friend to the user
						collection.update(
							{
								"_id": userId
							},
							{
								"$addToSet": { friends: json_data["friendId"] }
							}
						);

						// Add the user to the friend
						collection.update(
							{
								"_id": friendId
							},
							{
								"$addToSet": { friends: json_data["_id"] }
							}
						);

						callback(true);
					 }
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * addWallText()
		 */
		var addWallText = function(json_data, callback) {
			ol.logger("addWallText() called", filename);
			if (mongo_db._state == "connected") {
				mongo_db.collection("wallposts", function(err, collection) {
					collection.insert(
						json_data,
						{
							safe: true
						},
						function(err, res) {
							if (!err) {
								ol.logger("Inserted a wall post to DB", filename);
								callback(true);
							}
							else {
								ol.logger("ERROR: Wall not not added to DB", filename);
								callback(false);
							}
						}
					);
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}
	
		/*
		 * getWallText()
		 * Returns an array with the user's wallposts
		 */
		var getWallText = function(json_data, callback) {
			ol.logger("getWallText() called", filename);
			if (mongo_db._state == "connected") {
				var bla = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["to_id"]);
				mongo_db.collection("wallposts", function(err, collection) {
					if (!err) {
						collection.find(
							json_data
						).toArray(function(err, docs) {
							if (docs != [] && docs.length > 0) {
								ol.logger("Returning a user's wallposts", filename);
								callback(true, docs);
							}
							else {
								ol.logger("ERROR: Could not return a user's wallposts", filename);
								callback(false);
							}
						});
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}

		/*
		 * checkFriendship()
		 * Returns true if two users are friends, false if not
		 */
		var checkFriendship = function(json_data, callback) {
			ol.logger("checkFriendship() called", filename);
			if (mongo_db._state == "connected") {

				var userId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["userId"]);
				var friendId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["friendId"]);

				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.findOne(
							{
								_id: {$in: [userId, friendId]},
								friends: {$in: [json_data["userId"], json_data["friendId"]]}
							},
							function(err, docs) {
								if (docs != undefined) {
									ol.logger("Returning  as friendship status", filename);
									callback(true);
								}
								else {
									ol.logger("Returning FALSE as friendship status", filename);
									callback(false);
								}
							});
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", filename);
		}
	}
	else
		ol.logger("ERROR: DB connection NOT OPEN", filename);

	exports.registerUser = registerUser;
	exports.getUser = getUser;
	exports.getUserFriends = getUserFriends;
	exports.search = search;
	exports.addUserFriend = addUserFriend;
	exports.addWallText = addWallText;
	exports.getWallText = getWallText;
	exports.checkFriendship = checkFriendship;
});