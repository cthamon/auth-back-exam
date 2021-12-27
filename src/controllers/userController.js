const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const UserModel = require('../models/User.model');

exports.findMe = async (req, res, next) => {
    try {
        const me = req.user;
        const user = await UserModel.findOne({ _id: me._id });
        return res.send(user);
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { email, firstName, lastName, password, education, hobbies } = req.body;
        const { filename } = req.file;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await UserModel.create({ email, firstName, lastName, password: hashedPassword, education, hobbies, profile: filename });
        const token = jwt.sign({ _id: newUser._id, email: newUser.email }, "SECRET", { expiresIn: +3600 });
        return res.status(201).json(token);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email } = req.body;
        const foundUser = await UserModel.findOne({ email });
        const token = jwt.sign({ _id: foundUser._id, email: foundUser.email }, "SECRET", { expiresIn: +3600 });
        return res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const me = req.user;
        const { firstName, lastName, education, hobbies } = req.body;
        const updatedUser = await UserModel.findOneAndUpdate({ _id: me._id }, { firstName, lastName, education, hobbies }, { new: true });
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const me = req.user;
        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await UserModel.findOneAndUpdate({ _id: me._id }, { password: hashedPassword }, { new: true });
        return res.status(200).json("Password successfully changed");
    } catch (error) {
        next(error);
    }
};

exports.changeProfile = async (req, res, next) => {
    try {
        const me = req.user;
        const foundUser = await UserModel.findOne({ _id: me._id });
        fs.unlink(`public/images/${foundUser.profile}`, (err) => { if (err) return next(err); });
        const { filename } = req.file;
        const updatedUser = await UserModel.findOneAndUpdate({ _id: me._id }, { profile: filename }, { new: true });
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};