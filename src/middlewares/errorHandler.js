module.exports = function errorHandler(err, req, res, next) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError" || err.message === "tokenNotVerify") {
        res.status(401).json({ message: "You are unauthorized" });
    }
    if (err.message === "tokenNotProvided") {
        res.status(401).json({ message: "User must be logged in" });
    }
    res.status(500).json({ message: err.message });
}