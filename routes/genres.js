const router = require('express').Router();
const courseDebugger = require('debug')('app:course')
const { Genre, validate } = require('../models/genre');


router.get('/', async (req, res, next) => {
    const genres = await Genre.find().select('name');
    res.send(genres);
});

router.get('/:id', async (req, res, next) => {
    if (!req.params.id) {
        res.statusCode = 400;
        return res.send('id required!');
    }

    const genre = await Genre.findById(req.params.id);

    if (!genre) {
        res.statusCode = 404;
        return res.send('No genre found with given id!');
    }

    res.send(genre);

})


router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    const genre = new Genre({
        name: req.body.name,
    });

    await genre.save();
    res.send(genre);
});

router.put('/:id', async (req, res, next) => {
    const { error } = validate(req.body);

    if (error) {
        res.statusCode = 400;
        return res.send(error.details[0].message);
    }

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true, },
    );

    if (!genre) {
        res.statusCode = 404;
        return res.send('No genre found with given id!');
    }

    res.send(genre);
});

router.delete('/:id', async (req, res, next) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
        res.statusCode = 404;
        return res.send('No genre found with given id!');
    }

    res.send(genre);
});


module.exports = router;