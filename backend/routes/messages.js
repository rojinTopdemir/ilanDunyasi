const express = require('express');
const router = express.Router();
const db = require('../db');

// Mesaj gönder
router.post('/', (req, res) => {
    const { sender_id, receiver_id, listing_id, content } = req.body;
    db.query(
        'INSERT INTO messages (sender_id, receiver_id, listing_id, content) VALUES (?, ?, ?, ?)',
        [sender_id, receiver_id, listing_id, content],
        (err, results) => {
            if (err) return res.status(500).json({ hata: err.message });
            res.json({ mesaj: 'Mesaj gönderildi!', id: results.insertId });
        }
    );
});

// Kullanıcının mesajlarını getir
router.get('/:user_id', (req, res) => {
    db.query(
        `SELECT messages.*, 
      sender.name as gonderen, 
      receiver.name as alici,
      listings.title as ilan_baslik
     FROM messages 
     LEFT JOIN users sender ON messages.sender_id = sender.id
     LEFT JOIN users receiver ON messages.receiver_id = receiver.id
     LEFT JOIN listings ON messages.listing_id = listings.id
     WHERE messages.receiver_id = ? OR messages.sender_id = ?
     ORDER BY messages.created_at DESC`,
        [req.params.user_id, req.params.user_id],
        (err, results) => {
            if (err) return res.status(500).json({ hata: err.message });
            res.json(results);
        }
    );
});

// İki kullanıcı arasındaki mesajları getir
router.get('/konusma/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    db.query(
        `SELECT messages.*, sender.name as gonderen 
     FROM messages 
     LEFT JOIN users sender ON messages.sender_id = sender.id
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
     ORDER BY messages.created_at ASC`,
        [user1, user2, user2, user1],
        (err, results) => {
            if (err) return res.status(500).json({ hata: err.message });
            res.json(results);
        }
    );
});

module.exports = router;