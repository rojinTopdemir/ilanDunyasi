const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ hata: 'Dosya yüklenemedi' });
    res.json({ url: `https://ilandunyasi.onrender.com/uploads/${req.file.filename}` });
});

module.exports = router;