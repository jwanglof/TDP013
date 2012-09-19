var getAllMessages = function(data, err) {
	$.each(data, function(i, items) {
		// Make a new Mongo-function that checks what value a collection have.
		// Set it to true or false so the user can set a message to both read and unread.
		if (items["flag"] == true) {
			var tweetClass = "tweet_msgs_read";
		}
		else {
			var tweetClass = "tweet_msgs_unread";
		}

		$("<div/>", {
			"class": tweetClass,
			text: items["message"],

			click: function() {
				$.getJSON("http://localhost:8888/flag?id=" + items["_id"]);
				$(this).css("opacity", "0.2");
			}
		}).prependTo("#tweets");
	});
}

var addNewTweet = function(data, err) {
	$("<div/>", {
		"class": "tweet_msgs_unread",
		text: $("#tweet_textarea").val(),
		click: function() {
			$.getJSON("http://localhost:8888/flag?id=" + data[0]["_id"]);
			$(this).css("opacity", "0.2");
		}
	}).prependTo("#tweets");

	// Empty the textarea
	$("#tweet_textarea").val("");

	// Reset the character counter
	chars = 140;
	$("#total_chars").text("Characters left: " + chars);
}

$(document).ready(function() {
	// Show how many characters the user have left to write and update total_chars
	var chars = 140;
	$("#total_chars").text("Characters left: " + chars);

	// Hide error_msg-div. Will be shown when there is an error
	$("#error_msg").hide();

	$.ajax({
		url: "http://localhost:8888/getall",
		dataType: "json",
		success: getAllMessages,
		error: function(jqXHR, textStatus, errorThrown) {
			$("#error_msg").text("Error! textStatus: " + textStatus + " === errorThrown: " + errorThrown);
			$("#error_msg").show("fast");
		}
	});

	// Whenever a key is pressed it will subtract from the total characters used
	// If backspace is pressed it will add to the total characters
	$("#tweet_textarea").keydown(function(e) {
		chars = 140 - $(this).val().length;

		if (e.keyCode == 8 || e.keyCode == 46) {
			if (chars < 140) {
				chars++;
			}
		}
		else if (chars < 1) {
			chars = 0;
		}
		else {
			chars--;
		}

		// Update total_chars-div
		$("#total_chars").text("Characters left: " + chars);		
	});

	// When the form is submitted
	$("#tweet_form").submit(function() {
		// Check to see that the strint isn't empty!
		if ($("#tweet_textarea").val()) {

			$.ajax({
				url: "http://localhost:8888/save",
				dataType: "json",
				data: {
					text: $("#tweet_textarea").val()
				},
				success: addNewTweet,
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_msg").text("Error! <br />jqXHR: " + jqXHR + " <br />textStatus: " + textStatus + " <br />errorThrown: " + errorThrown);
					$("#error_msg").show("fast");
				}
			});

		}

		// If the tweet contains more then 140 characters.
		// This can't (?) happen since there is a maxlength on the element
		else if ($("#tweet_textarea").val().length > 140) {
			$("#error_msg").text("You have exceeded 140 characters in your message. Please remove some and post again.");
			$("#error_msg").show("slow");
		}

		// If the tweet doesn't contain any characters
		else {
			$("#error_msg").text("You need to write something in the textarea below. Stupid...");
			$("#error_msg").show("slow");
		}
		return false;
	});
});