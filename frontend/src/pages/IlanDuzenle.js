import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function IlanDuzenle({ kullanici, ilanlariGetir }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', description: '', price: '', location: '', category_id: 1
    });

    useEffect(() => {
        axios.get(`https://ilandunyasi.onrender.com/api/listings/${id}`)
            .then(res => setForm({
                title: res.data.title,
                description: res.data.description,
                price: res.data.price,
                location: res.data.location,
                category_id: res.data.category_id
            }))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://ilandunyasi.onrender.com/api/listings/${id}`, form)
            .then(() => {
                ilanlariGetir();
                navigate(`/ilan/${id}`);
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="form-container">
            <h2>İlanı Düzenle</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="İlan başlığı" value={form.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Açıklama" value={form.description} onChange={handleChange} />
                <input name="price" type="number" placeholder="Fiyat (₺)" value={form.price} onChange={handleChange} />
                <input name="location" placeholder="Konum" value={form.location} onChange={handleChange} />
                <select name="category_id" value={form.category_id} onChange={handleChange}>
                    <option value={1}>🏠 Emlak</option>
                    <option value={2}>🚗 Vasıta</option>
                    <option value={3}>📱 Elektronik</option>
                    <option value={4}>🛋️ Ev Eşyası</option>
                    <option value={5}>👕 Giyim</option>
                </select>
                <button type="submit">Güncelle</button>
            </form>
        </div>
    );
}

export default IlanDuzenle;