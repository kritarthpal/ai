const mongoose = require('mongoose');

// This is the blueprint for a user in our database
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Restricts input to valid blood types
    },
    // For current allergies and important medical conditions
    medicalInfo: {
        type: String,
        default: 'None'
    },
    // For past significant medical events or history
    medicalHistory: {
        type: String,
        default: 'None'
    }
});

// This line is crucial. It creates the model from the schema and makes it available to other files.
module.exports = mongoose.model('User', UserSchema);

