const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Kayıt ol
router.post('/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    // Şifreyi şifrele
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ hata: 'Bu email zaten kayıtlı!' });
                }
                return res.status(500).json({ hata: err.message });
            }
            res.json({ mesaj: 'Kayıt başarılı! 🎉' });
        }
    );
});

// Giriş yap
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ hata: err.message });
        if (results.length === 0) return res.status(400).json({ hata: 'Email veya şifre hatalı!' });

        const user = results[0];
        const sifreDogruMu = bcrypt.compareSync(password, user.password);

        if (!sifreDogruMu) return res.status(400).json({ hata: 'Email veya şifre hatalı!' });

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            'gizli_anahtar_123',
            { expiresIn: '7d' }
        );

        res.json({
            mesaj: 'Giriş başarılı!',
            token,
            kullanici: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    });
});

module.exports = router;