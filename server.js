const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.'));

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '.', 'index.html'));
});


app.listen(5500, () => {
    console.log('Listening on port 5500');
});