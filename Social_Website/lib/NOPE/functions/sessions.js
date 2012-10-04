var getSessionStatus = function(req, callback) {
	if (req.session.userId)
		var setSession = true;
	else
		var setSession = false;

	return setSession;
}

exports.getSessionStatus = getSessionStatus;