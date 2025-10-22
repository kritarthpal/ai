// ... (imports and middleware setup) ...

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB connected successfully."); // Original log

		// --- ADD THIS DELAY FOR TESTING ---
		console.log("Waiting 3 seconds before starting server...");
		setTimeout(() => {
			// Start the server ONLY after the delay
			app.listen(PORT, () => {
				console.log(`Server is running on http://localhost:${PORT}`);
			});
		}, 3000); // 3000 milliseconds = 3 seconds
		// --- END OF ADDED DELAY ---
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		// Optional: Exit if DB connection fails criticaly
		// process.exit(1);
	});

// --- REMOVE or COMMENT OUT the original app.listen here ---
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
