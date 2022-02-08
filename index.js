const express = require('express');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');

const coursesRoute = require('./routes/courses');

const app = express();

console.log(`Application Name: ${config.get('name')}`);

// middlewares
app.use(express.json());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled.');
    startupDebugger('Morgan enabled!');
}

// app routes registration
app.use('/api/courses', coursesRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on the port: ${port}`);
});