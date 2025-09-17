const express = require("express");
const { Pool } = require('pg');
const app = express();
const port = 3000;

const db = new Pool({
    host: 'db',
    port: 5432,
    user: 'user',
    password: 'pass',
    database: 'myapp'
});

// Middleware logs
app.use((req, res, next) => {
    const t0 = Date.now();

    res.on('finish', () => {
        const t1 = Date.now();
        console.log(`${req.method} ${req.path} ${res.statusCode} ${t1 - t0}ms`)
    });
    next()
});

// Endpoints
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get('/next-metro', (req, res) => {
    const { station } = req.query;
    if (!station) {
        res.status(400).json({ error: "station manquante" });
    }

    const result = nextArrival();
    res.json({
        station,
        nextArrival: result.nextArrival,
        isLast: result.isLast,
        headwayMin: result.headwayMin,
        tz: result.tz
    });
});

app.get('/now', (req, res) => {
    db.query('SELECT NOW()').then(result => {
        res.json(result.rows[0]);
    });
});

// Methodes
function nextArrival(now = new Date(), headwayMin = 3) {
    const tz = 'Europe/Paris';
    const toHM = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const end = new Date(now); end.setHours(1, 15, 0, 0);
    const lastWindow = new Date(now); lastWindow.setHours(0, 45, 0, 0);
    if (now > end) return { service: 'closed', tz };
    const next = new Date(now.getTime() + headwayMin * 60 * 1000);
    return { nextArrival: toHM(next), isLast: now >= lastWindow, headwayMin, tz };
}

// Middleware 404
app.use((req, res, next) => {
    res.status(404).send("404 : Not found")
});

// Port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});