const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser);
let db = new sqlite3.Database('./db/main.db');

app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM main', (err, rows) => {
        res.json(rows);
    });
});


app.listen(5000, () => console.log('Example app running on port 5000'));