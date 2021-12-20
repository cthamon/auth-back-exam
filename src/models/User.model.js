const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            lowercase: true,
            required: true
        },
        lastName: {
            type: String,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        education: {
            level: String,
            field: String,
            institute: String,
            year: Number
        },
        hobbies: [String],
        profile: String
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;