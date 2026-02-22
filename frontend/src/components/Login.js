import React, { useState } from 'react';
import axios from 'axios';

function Login({ onGirisYapildi, sayfaDegistir }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [hata, setHata] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://ilandunyasi.onrender.com/api/auth/login', form)
            .then(res => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('kullanici', JSON.stringify(res.data.kullanici));
                onGirisYapildi(res.data.kullanici);
            })
            .catch(err => setHata(err.response?.data?.hata || 'Bir hata oluştu'));
    };

    return (
        <div className="form-container">
            <h2>Giriş Yap</h2>
            {hata && <p className="hata-mesaj">{hata}</p>}
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required />
                <button type="submit">Giriş Yap</button>
            </form>
            <p className="form-alt-link">Hesabın yok mu? <span onClick={() => sayfaDegistir('register')}>Kayıt Ol</span></p>
        </div>
    );
}

export default Login;