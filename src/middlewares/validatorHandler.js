const { validationResult } = require('express-validator');

module.exports = function handleValidationError(req, res, next) {
    const error = validationResult(req).formatWith(({ msg }) => ({ message: msg }));
    if (!error.isEmpty()) {
        return res.status(400).json(error.array({ onlyFirstError: true }));
    }
    next();
};