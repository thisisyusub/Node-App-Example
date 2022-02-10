const router = require('express').Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        isGold:
        {
            type: Boolean,
            default: false,
        },
        phone:
        {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
    }
));

router.get('/', async (req, res, next) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res, next) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    let customer = Customer({
        name: req.body.name,
        phone: req.body.phone,
    });

    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res, next) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        },
        {
            new: true,
        },
    );

    if (!customer) {
        res.statusCode = 404;
        return res.send('No customer found with given id!');
    }

    res.send(customer);
});

router.delete('/:id', async (req, res, next) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
        res.statusCode = 404;
        return res.send('No customer found with given id!');
    }

    res.send(customer);
});

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(customer);
}

module.exports = router;