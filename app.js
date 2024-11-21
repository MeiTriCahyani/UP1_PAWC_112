const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventaris_kandang'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM kandang';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { kandang: results });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { nama_kandang, kapasitas, kondisi, lokasi } = req.body;
    const sql = 'INSERT INTO kandang (nama_kandang, kapasitas, kondisi, lokasi) VALUES (?, ?, ?, ?)';
    db.query(sql, [nama_kandang, kapasitas, kondisi, lokasi], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM kandang WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { kandang: results[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nama_kandang, kapasitas, kondisi, lokasi } = req.body;
    const sql = 'UPDATE kandang SET nama_kandang = ?, kapasitas = ?, kondisi = ?, lokasi = ? WHERE id = ?';
    db.query(sql, [nama_kandang, kapasitas, kondisi, lokasi, id], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM kandang WHERE id = ?';
    db.query(sql, [id], err => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
