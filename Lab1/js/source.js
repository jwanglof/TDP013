$(document).ready(function() {
	// Show how many characters the user have left to write and update total_chars
	var chars = 140;
	$("#total_chars").text("Characters left: " + chars);
	
	$("#error_msg").hide();

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

		$("#total_chars").text("Characters left: " + chars);		
	});
	
	$("#tweet_form").submit(function() {
		// Check to see that the strint isn't empty!
		if ($("#tweet_textarea").val()) {

			// 
			$("<div/>", {
				"class": "tweets_msg",
				text: $("#tweet_textarea").val(),
				click: function() {
					$(this).css("opacity", "0.2");
				}
			}).prependTo("#tweets");

			// Resets the textarea
			$("#tweet_textarea").val("");
			
			chars = 140;
			$("#total_chars").text("Characters left: " + chars);
		}
		else if ($("#tweet_textarea").val().length > 140) {
			$("#error_msg").text("You have exceeded 140 characters in your message. Please remove some and post again.");
			$("#error_msg").show("slow");
		}
		else {
			$("#error_msg").text("You need to write something in the textarea below. Stupid...");
			$("#error_msg").show("slow");
		}
		return false;
	});
});