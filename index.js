const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on the port: ${port}`);
});