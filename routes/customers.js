const router = require('express').Router();
const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res, next) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);

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
    const { error } = validate(req.body);

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

module.exports = router;