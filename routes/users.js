const router = require('express').Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const { User, validate } = require('../models/user');


router.get('/me', auth, async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.statusCode = 400;
        return res.send('User already registered!');
    }


    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    return res.header('Token', user.generateAuthToken()).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;