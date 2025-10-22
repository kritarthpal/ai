const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('./middleware/authMiddleware'); // <-- Import our security guard
const User = require('./User'); // <-- Import the User model to find users
require('dotenv').config();

const router = express.Router();

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- Chat Route ---
// The 'authMiddleware' is our security guard. It will run before the main logic.
router.post('/', authMiddleware, async (req, res) => {
    try {
        // --- 1. Find the User in the Database ---
        // The middleware gives us 'req.user.id'
        const user = await User.findById(req.user.id).select('-password'); // Find user but exclude password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ msg: 'Message is required' });
        }

        // --- 2. Create a Personalized Prompt ---
        // We now include the user's actual medical profile!
        const prompt = `
            You are an expert AI First Aid Assistant.
            Your primary goal is to provide clear, simple, and safe first-aid instructions tailored to the specific user.
            
            USER'S MEDICAL PROFILE:
            - Name: ${user.name}
            - Age: ${user.age}
            - Blood Group: ${user.bloodGroup}
            - Known Allergies/Conditions: ${user.medicalInfo}
            - Past Medical History: ${user.medicalHistory}

            IMPORTANT: You must consider this profile in your response. For example, if the user has a known allergy, your advice must not include that allergen.
            
            SAFETY DISCLAIMER: You must include a disclaimer in every response that says: "This is AI-generated advice. It is not a substitute for professional medical help. In a serious emergency, call your local emergency services immediately."

            Based on the user's profile and information from reputable medical organizations, answer the following user question:
            "${message}"
        `;

        // --- 3. Send to Gemini and get the response ---
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        res.json({ reply: aiText });

    } catch (err) {
        console.error("Error in personalized Gemini API call:", err);
        res.status(500).send('Error communicating with AI service');
    }
});

module.exports = router;

