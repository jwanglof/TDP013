$(document).ready(function() {
	$("#registerForm").validate({
		rules: {
			firstname: "required",
			surname: "required",
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 5
			},
			password_repeat: {
				required: true,
				minlength: 5,
				equalTo: "#regPassword"
			}
		},
			messages: {
				firstname: "Please enter your firstname",
				surname: "Please enter your surname",
				email: "Please enter a valid e-mail address",
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters"
				},
				password_repeat: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters",
					equalTo: "Please enter the same password as above"
				}
			},
		submitHandler: function(form) {
			var registerForm = {};
			registerForm["firstname"] = $("#regFirstname").val();
			registerForm["surname"] = $("#regSurname").val();
			registerForm["email"] = $("#regEmail").val();
			registerForm["password"] = $("#regPassword").val();
			registerForm["passwordRep"] = $("#regPassworRep").val();

			$.ajax({
				url: "http://localhost:8888/register",
				type: "POST",
				dataType: "json",
				data: registerForm,
				success: function(result) {
					alert(result);
				}
			});
			return false;
		}
	});

	$("#loginForm").validate({
		rules: {
			liEmail: {
				required: true,
				email: true
			},
			liPassword: {
				required: true,
				minlength: 5
			}
		},
		messages: {
			liEmail: "",
			liPassword: ""
		},
		submitHandler: function(form) {
			var loginForm = {};
			loginForm["email"] = $("#liEmail").val();
			loginForm["password"] = $("#liPassword").val();

			$.ajax({
				url: "http://localhost:8888/login",
				type: "POST",
				dataType: "json",
				data: loginForm,
				statusCode: {
					200: function(result) {
						//alert(result._id);
						sessionStorage._id = result._id;
						form.submit();
						window.location.replace("signed_in.html");
					},
					500: function() {
						alert("Login failed. Try again plx.");
					}
				}
			});
		}
	});

	$("#linkProfile").click(function() {
		var param = document.URL.split('#')[1];
		var userID;

		if (param.length === 24)
			userID = param;
		else
			userID = sessionStorage._id;

		profilePage(userID);
	});

	$("#linkFriends").click(function() {
		$.ajax({
			url: "http://localhost:8888/friends",
			type: "POST",
			dataType: "json",
			data: sessionStorage,
			statusCode: {
				200: function(result) {
					$("#siteContent").text("");
					
					$.each(result, function(k, v) {
						$("<p/>", {
							text: v.firstname + " " + v.surname,
							"style": "color: #0288CC; cursor: pointer",
							"class": "friend",
							click: function() {
								profilePage(v._id);
							}
						}).appendTo("#siteContent");
					});
				},
				500: function() {
					$("#siteContent").text("");
					
					$("<p/>", {
						text: "You ain't got no friends",
						"style": "color: #0288CC"
					}).appendTo("#siteContent");
				}
			}
		});
	});

	$("#linkHome").click(function() {
/*
		if (sessionStorage._id != "undefined") {
			window.location.replace("/");
		}
		else
			window.location.replace("signed_in.html");
*/
		return false;
	});

	$("#linkLogout").click(function() {
		sessionStorage.clear();
		//window.location("/");
		window.location.replace("index.html");
	});

	$("#searchButton").click(function() {
		$.ajax({
			url: "http://localhost:8888/search",
			type: "POST",
			dataType: "json",
			data: { email: $("#searchString").val() },
			statusCode: {
				200: function(result) {
					$("#searchString").val("");
					$("#siteContent").text("");

					$("<a/>", {
						//href: "#" + result[0]._id,
						text: result[0].firstname + " " + result[0].surname,
						click: function() {
							profilePage(result[0]._id);
						}
					}).appendTo("#siteContent");
				},
				500: function() {
					$("<h4/>", {
						text: "No users with that e-mail"
					}).appendTo("#siteContent");
				}
			}
		});

		return false;
	});

	$("#linkBefriend").click(function() {
		alert("yuuu[");
		return false;
	});

});

function profilePage(userID) {
	$.ajax({
		url: "http://localhost:8888/profile",
		type: "POST",
		dataType: "json",
		data: { _id: userID },
		statusCode: {
			200: function(result) {
				$("#siteContent").text("");

				if (userID == sessionStorage._id) {
					$("<h4/>", {
						text: "Welcome back, " + result.firstname
					}).appendTo("#siteContent");
					$("#siteContent").append("Full name: " + result.firstname + " " + result.surname + "<br />");
				}

				else {
					$("<h4/>", {
						text: result.firstname + " " + result.surname
					}).appendTo("#siteContent");

					// Look if the user logged in and the profile being watch is friends
					// If they are friends it till print 'Already friends'
					// If they aren't it will print 'Be my friend?'
					befriend(sessionStorage._id, result._id, function(res) {
						if (res) {
							$("<p/>", {
								text: "Already friends",
								"style": "color: #ff00ff"
							}).appendTo("#siteContent");
						}
						else {
							$("<p/>", {
								text: "Be my friend?",
								"style": "color: #0288CC; cursor: pointer;",
								click: function() {
									alert("You are now friends");

									$.ajax({
										url: "http://localhost:8888/addFriend",
										type: "POST",
										dataType: "json",
										data: {_id: sessionStorage._id, friendId: result._id}
									});
									
								}
							}).appendTo("#siteContent");
						}
					});
					
				}

				$("#siteContent").append("Email: " + result.email + "<br />");
				$("#siteContent").append("ID: " + result._id + "<br />");

				$("#siteContent").append("<textarea id=\"wallTextarea\" cols=\"5\" rows=\"5\"></textarea>");

				$.ajax({
					url: "http://localhost:8888/getWall",
					type: "POST",
					dataType: "json",
					data: {to_id: userID},
					statusCode: {
						200: function(result) {
							$.each(result, function(k, v) {
								$("<p/>", {
									text: v.from + " wrote " + v.wallpost,
									"style": "color: #0288CC; cursor: pointer; margin-bottom: 0px",
									click: function() {
										profilePage(v._id);
									}
								}).appendTo("#siteContent");
								
								/*$("<p/>", {
									text: v.walltext,
									"style": "color: #000000"
								}).appendTo("#siteContent");*/
								
							});
						},
						500: function() {
							alert("Nope");
						}
					}
				});		
			},
			500: function() {
				// Put an error DIV in the middle of navbar
				alert("Wrong user ID");
			}
		}
	});
}

function befriend(userID, friendID, callback) {
	$.ajax({
		url: "http://localhost:8888/checkFriendship",
		type: "POST",
		dataType: "json",
		data: {userId: userID, friendId: friendID},
		statusCode: {
			200: function(result) {
				callback(true);
			},
			500: function() {
				callback(false);
			}
		}
	});
}

/*function getWallposts(to_id, callback) {
	$.ajax({
		url: "http://localhost:8888/getWall",
		type: "POST",
		dataType: "json",
		data: {to_id: userID},
		statusCode: {
			200: function(result) {
				callback(true);
			},
			500: function() {
				callback(false);
			}
		}
	});		
}*/

