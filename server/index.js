const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
let db = new sqlite3.Database('./db/main.db');

app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM main', (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/data', (req, res) => {
    console.log(req.body);
    let MILES = req.body.MILES;
    let GAS = req.body.GAS;
    let PRICE_PER_GAL = req.body.PRICE_PER_GAL;
    if (typeof MILES !== "number" || typeof GAS !== "number" || typeof PRICE_PER_GAL !== "number") {
        res.sendStatus(400);
    }
    else {
        db.run("INSERT INTO main VALUES(?, ?, ?)", MILES, GAS, PRICE_PER_GAL, (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
});


app.listen(5000, () => console.log('Example app running on port 5000'));