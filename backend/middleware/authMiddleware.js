const jwt = require("jsonwebtoken");
require("dotenv").config();

// This middleware function acts as a security guard for our routes
module.exports = function (req, res, next) {
	// 1. Get the token from the request header
	const authHeader = req.header("Authorization");

	// 2. Check if there's no token
	if (!authHeader) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	try {
		// 3. Extract the token from "Bearer <token>"
		const token = authHeader.split(" ")[1];

		// 4. Verify the token using our secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// 5. If valid, add the user's ID to the request object
		req.user = decoded.user;

		// 6. Pass control to the next function (our chat logic)
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};
