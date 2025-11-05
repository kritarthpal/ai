const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User"); // This imports the new User.js model
require("dotenv").config();

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
	// These fields now match your new User.js model
	const { name, email, password, age, medicalHistory } = req.body;

	try {
		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// Create a new user instance with the correct data
		user = new User({
			name,
			email,
			password,
			age,
			medicalHistory,
		});

		// Encrypt the password before saving
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		// Save the complete user profile to the database
		await user.save();

		// --- FIX: Fetch the user *without* the password to send back ---
		const userPayload = await User.findById(user.id).select("-password");

		// Create and return a JSON Web Token (JWT) for authentication
		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "5h" }, // Changed to 5 hours
			(err, token) => {
				if (err) throw err;
				// --- FIX: Send back token AND user object ---
				res.json({ token, user: userPayload });
			}
		);
	} catch (err) {
		console.error("Register error:", err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// --- FIX 1: Fetch user *with* password to check credentials ---
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		// Compare the provided password with the stored hashed password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		// --- FIX 2: Create payload for JWT ---
		const payload = {
			user: {
				id: user.id,
			},
		};

		// --- FIX 3: Fetch user *without* password to send in response ---
		const userPayload = await User.findById(user.id).select("-password");

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "5h" },
			(err, token) => {
				if (err) throw err;
				// --- FIX 4: Send back token AND user object ---
				res.json({ token, user: userPayload });
			}
		);
	} catch (err) {
		console.error("Login error:", err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
