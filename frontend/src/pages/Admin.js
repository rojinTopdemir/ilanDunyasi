import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin({ kullanici }) {
    const [aktifSekme, setAktifSekme] = useState('stats');
    const [stats, setStats] = useState({});
    const [kullanicilar, setKullanicilar] = useState([]);
    const [ilanlar, setIlanlar] = useState([]);

    const headers = { admin_id: kullanici?.id };

   useEffect(() => {
  if (!kullanici) return;
  verileriGetir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [kullanici]);

    const verileriGetir = () => {
        axios.get('https://ilandunyasi.onrender.com/api/admin/stats', { headers })
            .then(res => setStats(res.data))
            .catch(err => console.log(err));
        axios.get('https://ilandunyasi.onrender.com/api/admin/users', { headers })
            .then(res => setKullanicilar(res.data))
            .catch(err => console.log(err));
        axios.get('https://ilandunyasi.onrender.com/api/admin/listings', { headers })
            .then(res => setIlanlar(res.data))
            .catch(err => console.log(err));
    };

    const kullaniciSil = (id) => {
        if (window.confirm('Kullanıcıyı silmek istediğine emin misin?')) {
            axios.delete(`https://ilandunyasi.onrender.com/api/admin/users/${id}`, { headers })
                .then(() => verileriGetir())
                .catch(err => console.log(err));
        }
    };

    const ilanSil = (id) => {
        if (window.confirm('İlanı silmek istediğine emin misin?')) {
            axios.delete(`https://ilandunyasi.onrender.com/api/admin/listings/${id}`, { headers })
                .then(() => verileriGetir())
                .catch(err => console.log(err));
        }
    };

    if (!kullanici) return <div className="form-container"><p>Giriş yapmalısın!</p></div>;

    return (
        <div className="admin-container">
            <h2>⚙️ Admin Paneli</h2>

            <div className="admin-sekmeler">
                <button className={aktifSekme === 'stats' ? 'aktif' : ''} onClick={() => setAktifSekme('stats')}>📊 İstatistikler</button>
                <button className={aktifSekme === 'kullanicilar' ? 'aktif' : ''} onClick={() => setAktifSekme('kullanicilar')}>👥 Kullanıcılar</button>
                <button className={aktifSekme === 'ilanlar' ? 'aktif' : ''} onClick={() => setAktifSekme('ilanlar')}>📋 İlanlar</button>
            </div>

            {aktifSekme === 'stats' && (
                <div className="stats-grid">
                    <div className="stat-kart">
                        <h3>{stats.kullanici}</h3>
                        <p>👥 Toplam Kullanıcı</p>
                    </div>
                    <div className="stat-kart">
                        <h3>{stats.ilan}</h3>
                        <p>📋 Toplam İlan</p>
                    </div>
                    <div className="stat-kart">
                        <h3>{stats.mesaj}</h3>
                        <p>💬 Toplam Mesaj</p>
                    </div>
                </div>
            )}

            {aktifSekme === 'kullanicilar' && (
                <div className="admin-tablo-container">
                    <table className="admin-tablo">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ad</th>
                                <th>Email</th>
                                <th>Telefon</th>
                                <th>Admin</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kullanicilar.map(k => (
                                <tr key={k.id}>
                                    <td>{k.id}</td>
                                    <td>{k.name}</td>
                                    <td>{k.email}</td>
                                    <td>{k.phone || '-'}</td>
                                    <td>{k.is_admin ? '✅' : '❌'}</td>
                                    <td>
                                        {!k.is_admin && (
                                            <button className="admin-sil-btn" onClick={() => kullaniciSil(k.id)}>🗑️ Sil</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {aktifSekme === 'ilanlar' && (
                <div className="admin-tablo-container">
                    <table className="admin-tablo">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Başlık</th>
                                <th>Fiyat</th>
                                <th>Kullanıcı</th>
                                <th>Kategori</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ilanlar.map(i => (
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td>{i.title}</td>
                                    <td>{Number(i.price).toLocaleString('tr-TR')} ₺</td>
                                    <td>{i.kullanici}</td>
                                    <td>{i.kategori}</td>
                                    <td>
                                        <button className="admin-sil-btn" onClick={() => ilanSil(i.id)}>🗑️ Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Admin;