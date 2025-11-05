const mongoose = require('mongoose');

// This is the updated blueprint for a user in our "BAYMAX" project.
// It now matches the fields in your new frontend/src/components/Register.tsx form.
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    // This field comes from your new Register.tsx form
    medicalHistory: {
        type: String,
        default: 'None'
    }
});

// This line is crucial. It creates the model from the schema.
module.exports = mongoose.model('User', UserSchema);

