$(document).ready(function() {
	// #message is where all alerts are shown
	$("#messages").hide();

	/*
	 * Use JQuery's validate-plugin for easier validation checks
	 */
	$("#registerForm").validate({
		errorLabelContainer: $("#messages"),
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
			// Add everything to a JSON-object
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
				statusCode: {
					200: function() {
						// Resets the input-fields
						$("#regFirstname").val("");
						$("#regSurname").val("");
						$("#regEmail").val("");
						$("#regPassword").val("");
						$("#regPasswordRep").val("");
						
						// Add text to #message
						$("#messages").addClass("alert-success");
						$("#messages").text("You are now registered. Please sign in.");
						$("#messages").show("fast");
					},
					500: function() {
						// Add an error-text to #message
						$("#messages").addClass("alert-error");
						$("#messages").text("You are NOT registered. Please try again.");
						$("#messages").show("fast");
					}
				}
			});

			return false;
		}
	});

	$("#loginForm").validate({
		errorLabelContainer: $("#messages"),
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
			liEmail: "Please enter a valid e-mail address",
			liPassword: ""
		},
		submitHandler: function(form) {
			// Add everything to a JSON-object
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
						/*
						 * Store the user's ID in a HTML5 session
						 * Submit the form
						 * Redirect the user to the 'user'-page
						 */
						sessionStorage._id = result._id;
						form.submit();
						window.location.replace("signed_in.html");
					},
					500: function() {
						// Add an error-text to #message
						$("#messages").addClass("alert-error");
						$("#messages").text("Login failed. Try again plx.");
						$("#messages").show("fast");
					}
				}
			});
		}
	});

	$("#linkProfile").click(function() {
		profilePage(sessionStorage._id);
	});

	$("#linkFriends").click(function() {
		$.ajax({
			url: "http://localhost:8888/friends",
			type: "POST",
			dataType: "json",
			data: sessionStorage,
			statusCode: {
				200: function(result) {
					/*
					 * Empty #siteContent
					 * Loop through result to get key (k) and value (v)
					 * Value contains the JSON-objects
					 * Appends all the friends to #siteContent as a p-element that acts like a hyperlink
					 */
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
		/*
		 * Remove all sessions that are stored
		 * Redirects the user to index
		 */
		sessionStorage.clear();
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
					/*
					 * Empty #searchString and #siteContent
					 * It will only return one user since it's only e-mails so a loop isn't necessary
					 * Append the search result to #siteContent as a p-element that acts like a hyperlink
					 */
					$("#searchString").val("");
					$("#siteContent").text("");

					$("<p/>", {
						text: result[0].firstname + " " + result[0].surname,
						"style": "color: #0288CC; cursor: pointer",
						"class": "friend",
						click: function() {
							profilePage(result[0]._id);
						}
					}).appendTo("#siteContent");
				},
				500: function() {
					$("#siteContent").text("");
					$("#messages").addClass("alert-error");
					$("#messages").text("No user with that e-mail");
					$("#messages").show("fast");
				}
			}
		});

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

				/*
				 * Check if the user want to see the user's profile or another user's
				 */
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

					/*
					 * Appends a textarea to the profile for the wallposts
					 * Add a click-function to the button and adds the wallpost to the user
					 */
					$("#siteContent").append("<textarea id=\"wallTextarea\" cols=\"5\" rows=\"5\"></textarea><button type=\"submit\" name=\"wallBtn\" id=\"wallBtn\" class=\"btn\">Write</button>");
					$("#wallBtn").click(function() {
						if ($("#wallTextarea").val()) {
							$.ajax({
								url: "http://localhost:8888/writeWall",
								type: "POST",
								dataType: "json",
								data: {wallpost: $("#wallTextarea").val(), to_id: userID, from_id: sessionStorage._id},
								statusCode: {
									200: function() {
										$("#messages").addClass("alert-success");
										$("#messages").text("Wallpost posted.");
										$("#messages").show("fast");
									},
									500: function() {
										$("#messages").addClass("alert-error");
										$("#messages").text("Wallpost NOT posted. Try again.");
										$("#messages").show("fast");
									}
								}
							});
						}
						else {
							$("#messages").addClass("alert-error");
							$("#messages").text("You have to write something");
							$("#messages").show("fast");
						}
					});

					/*
					 * Look if the user logged in and the profile being watch are friends
					 * If they are friends it till print 'Already friends'
					 * If they aren't it will print 'Be my friend?'
					 */
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
								"class": "beFriend",
								click: function() {
									$("#messages").addClass("alert-success");
									$("#messages").text("You are now friends.");
									$("#messages").show("fast");

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

				$("#siteContent").append("<br /> Email: " + result.email + "<br />");
				$("#siteContent").append("ID: " + result._id + "<br />");

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
							});
						},
						500: function() {
							$("#messages").addClass("alert-error");
							$("#messages").text("Could not get the wallposts.");
							$("#messages").show("fast");
						}
					}
				});		
			},
			500: function() {
				$("#messages").addClass("alert-error");
				$("#messages").text("Wrong user ID.");
				$("#messages").show("fast");
			}
		}
	});
}

/*
 * Returns true or false depending if the users are friends or not
 */
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


