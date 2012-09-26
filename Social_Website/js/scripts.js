$(document).ready(function() {
	$(".jwform").validate({
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
				equalTo: "#password"
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
			}
	});

	$(".jwform").submit(function() {

	});

});