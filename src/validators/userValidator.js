const { param, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/User.model');

exports.checkIdExist = () => {
    return [
        param("_id")
            .custom(async (_id) => {
                const foundUser = await UserModel.exists({ _id });
                if (!foundUser) throw new Error("data not found");
                return true;
            })
    ];
};

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace(/^Bearer\s/, "");
        if (!token) throw new Error("tokenNotProvided");
        const payload = await jwt.verify(token, "SECRET");
        if (!payload) throw new Error("tokenNotVerify");
        const foundUser = await UserModel.findOne({ _id: payload._id });
        if (!foundUser) throw new Error("tokenNotVerify");
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

exports.checkRegister = () => {
    return [
        body("email")
            .notEmpty().withMessage("E-mail is required")
            .isEmail().withMessage("Invalid email format"),
        body("firstName")
            .notEmpty().withMessage("First name is required")
            .isString().withMessage("First name must be string")
            .custom((firstName) => {
                if (!/^[A-Z]+$/i.test(firstName)) throw new Error("First name must be alphabet letters");
                return true;
            }),
        body("lastName")
            .notEmpty().withMessage("Last name is required")
            .isString().withMessage("Last name must be string")
            .custom((firstName) => {
                if (!/^[A-Z]+$/i.test(firstName)) throw new Error("Last name must be alphabet letters");
                return true;
            }),
        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("confirmPassword")
            .notEmpty().withMessage("Confirm Password is required")
            .custom((confirmPassword, { req }) => {
                if (confirmPassword !== req.body.password) throw new Error("Confirm password does not match password");
                return true;
            }),
    ];
};

exports.checkLogin = () => {
    return [
        body("email")
            .notEmpty().withMessage("E-mail is required")
            .isEmail().withMessage("Invalid email format"),
        body("password")
            .notEmpty().withMessage("Password is required")
            .custom(async (password, { req }) => {
                const foundUser = await UserModel.findOne({ email: req.body.email });
                if (!foundUser) throw new Error("email or password is incorrect");
                const isMatch = await bcrypt.compare(password, foundUser.password);
                if (!isMatch) throw new Error("email or password is incorrect");
            }),
    ];
};

exports.checkPassword = () => {
    return [
        body("currentPassword")
            .notEmpty().withMessage("Current password is required")
            .custom(async (password, { req }) => {
                const foundUser = await UserModel.findOne({ _id: req.user._id });
                if (!foundUser) throw new Error("user not found");
                const isMatch = await bcrypt.compare(password, foundUser.password);
                if (!isMatch) throw new Error("password is incorrect");
            }),
        body("newPassword")
            .notEmpty().withMessage("New password is required")
            .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
        body("confirmPassword")
            .notEmpty().withMessage("Confirm Password is required")
            .custom((confirmPassword, { req }) => {
                if (confirmPassword !== req.body.newPassword) throw new Error("Confirm password does not match password");
                return true;
            }),
    ];
};