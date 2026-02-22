const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin kontrolü middleware
const adminKontrol = (req, res, next) => {
    const { admin_id } = req.headers;
    db.query('SELECT is_admin FROM users WHERE id = ?', [admin_id], (err, results) => {
        if (err || results.length === 0 || !results[0].is_admin) {
            return res.status(403).json({ hata: 'Yetkisiz erişim!' });
        }
        next();
    });
};

// Tüm kullanıcıları getir
router.get('/users', adminKontrol, (req, res) => {
    db.query('SELECT id, name, email, phone, is_admin, created_at FROM users', (err, results) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json(results);
    });
});

// Kullanıcı sil
router.delete('/users/:id', adminKontrol, (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json({ mesaj: 'Kullanıcı silindi!' });
    });
});

// Tüm ilanları getir
router.get('/listings', adminKontrol, (req, res) => {
    db.query(
        `SELECT listings.*, users.name as kullanici, categories.name as kategori 
     FROM listings 
     LEFT JOIN users ON listings.user_id = users.id
     LEFT JOIN categories ON listings.category_id = categories.id
     ORDER BY listings.created_at DESC`,
        (err, results) => {
            if (err) return res.status(500).json({ hata: err.message });
            res.json(results);
        }
    );
});

// İlan sil
router.delete('/listings/:id', adminKontrol, (req, res) => {
    db.query('DELETE FROM listings WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ hata: err.message });
        res.json({ mesaj: 'İlan silindi!' });
    });
});

// İstatistikler
router.get('/stats', adminKontrol, (req, res) => {
    const stats = {};
    db.query('SELECT COUNT(*) as toplam FROM users', (err, r) => {
        stats.kullanici = r[0].toplam;
        db.query('SELECT COUNT(*) as toplam FROM listings', (err, r) => {
            stats.ilan = r[0].toplam;
            db.query('SELECT COUNT(*) as toplam FROM messages', (err, r) => {
                stats.mesaj = r[0].toplam;
                res.json(stats);
            });
        });
    });
});

module.exports = router;