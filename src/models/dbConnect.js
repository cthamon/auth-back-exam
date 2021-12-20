const mongoose = require('mongoose');

module.exports = async function connect() {
    const dbUri = "mongodb://localhost:27017/auth-app";
    try {
        await mongoose.connect(dbUri);
        console.log("DB connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};