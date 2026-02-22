const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm ilanları getir
router.get('/', (req, res) => {
    db.query('SELECT listings.*, categories.name as kategori, users.name as kullanici FROM listings LEFT JOIN categories ON listings.category_id = categories.id LEFT JOIN users ON listings.user_id = users.id', (err, results) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json(results);
    });
});

// Tek ilan getir
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM listings WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ hata: err.message });
        if (results.length === 0) return res.status(404).json({ hata: 'İlan bulunamadı' });
        res.json(results[0]);
    });
});

// İlan ekle
router.post('/', (req, res) => {
    const { title, description, price, location, image_url, user_id, category_id } = req.body;
    console.log('Gelen veri:', req.body);
    db.query(
        'INSERT INTO listings (title, description, price, location, image_url, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, price, location, image_url, user_id, category_id],
        (err, results) => {
            if (err) {
                console.error('SQL Hatası:', err);
                return res.status(500).json({ hata: err.message });
            }
            res.json({ mesaj: 'İlan eklendi!', id: results.insertId });
        }
    );
});

// İlan sil
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM listings WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json({ mesaj: 'İlan silindi!' });
    });
});
// İlan güncelle
router.put('/:id', (req, res) => {
    const { title, description, price, location, category_id } = req.body;
    db.query(
        'UPDATE listings SET title=?, description=?, price=?, location=?, category_id=? WHERE id=?',
        [title, description, price, location, category_id, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ hata: err.message });
            res.json({ mesaj: 'İlan güncellendi!' });
        }
    );
});

module.exports = router;