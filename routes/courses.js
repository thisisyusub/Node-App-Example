const router = require('express').Router();

const courses = [
    {
        id: 0,
        name: 'Course 1'
    },
    {
        id: 0,
        name: 'Course 1'
    },
];

router.get('/', (req, res, next) => {
    res.send(courses);
});


module.exports = router;