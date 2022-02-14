const router = require('express').Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');


router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.statusCode = 400;
        return res.send('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.statusCode = 400;
        return res.send('Invalid email or password');
    }


    res.send({ 'token': user.generateAuthToken() });
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(req);
}

module.exports = router;