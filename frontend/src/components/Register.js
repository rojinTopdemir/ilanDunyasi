import React, { useState } from 'react';
import axios from 'axios';

function Register({ sayfaDegistir }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [hata, setHata] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://ilandunyasi.onrender.com/api/auth/register', form)
            .then(() => {
                alert('Kayıt başarılı! Şimdi giriş yapabilirsin 🎉');
                sayfaDegistir('login');
            })
            .catch(err => setHata(err.response?.data?.hata || 'Bir hata oluştu'));
    };

    return (
        <div className="form-container">
            <h2>Kayıt Ol</h2>
            {hata && <p className="hata-mesaj">{hata}</p>}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Ad Soyad" value={form.name} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required />
                <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} />
                <button type="submit">Kayıt Ol</button>
            </form>
            <p className="form-alt-link">Zaten hesabın var mı? <span onClick={() => sayfaDegistir('login')}>Giriş Yap</span></p>
        </div>
    );
}

export default Register;