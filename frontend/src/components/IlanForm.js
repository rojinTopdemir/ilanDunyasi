import React, { useState } from 'react';
import axios from 'axios';

function IlanForm({ onIlanEklendi, kullanici }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        category_id: 1,
        user_id: kullanici.id,
        image_url: ''
    });
    const [foto, setFoto] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setYukleniyor(true);

        let image_url = '';

        if (foto) {
            const formData = new FormData();
            formData.append('image', foto);
            try {
                const res = await axios.post('https://ilandunyasi.onrender.com/api/upload', formData);
                image_url = res.data.url;
            } catch (err) {
                alert('Fotoğraf yüklenemedi!');
                setYukleniyor(false);
                return;
            }
        }

        axios.post('https://ilandunyasi.onrender.com/api/listings', { ...form, image_url })
            .then(() => {
                alert('İlan eklendi! 🎉');
                onIlanEklendi();
                setForm({ title: '', description: '', price: '', location: '', category_id: 1, user_id: kullanici.id, image_url: '' });
                setFoto(null);
            })
            .catch(err => console.log(err))
            .finally(() => setYukleniyor(false));
    };

    return (
        <div className="form-container">
            <h2>İlan Ver</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="İlan başlığı" value={form.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Açıklama" value={form.description} onChange={handleChange} />
                <input name="price" type="number" placeholder="Fiyat (₺)" value={form.price} onChange={handleChange} />
                <input name="location" placeholder="Konum (İstanbul, Ankara...)" value={form.location} onChange={handleChange} />
                <select name="category_id" value={form.category_id} onChange={handleChange}>
                    <option value={1}>🏠 Emlak</option>
                    <option value={2}>🚗 Vasıta</option>
                    <option value={3}>📱 Elektronik</option>
                    <option value={4}>🛋️ Ev Eşyası</option>
                    <option value={5}>👕 Giyim</option>
                </select>
                <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
                {foto && <p>📸 {foto.name} seçildi</p>}
                <button type="submit" disabled={yukleniyor}>
                    {yukleniyor ? 'Yükleniyor...' : 'İlanı Yayınla'}
                </button>
            </form>
        </div>
    );
}

export default IlanForm;