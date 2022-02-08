const express = require('express');
const morgan = require('morgan');
const config = require('config');

const app = express();

console.log(`Application Name: ${config.get('name')}`);

// middlewares
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled.!');
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on the port: ${port}`);
});