import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profil({ kullanici, ilanlariGetir }) {
    const [ilanlar, setIlanlar] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!kullanici) return;
        axios.get('https://ilandunyasi.onrender.com/api/listings')
            .then(res => setIlanlar(res.data.filter(i => i.user_id === kullanici.id)))
            .catch(err => console.log(err));
    }, [kullanici]);

    const ilanSil = (id) => {
        if (window.confirm('İlanı silmek istediğine emin misin?')) {
            axios.delete(`https://ilandunyasi.onrender.com/api/listings/${id}`)
                .then(() => {
                    setIlanlar(ilanlar.filter(i => i.id !== id));
                    ilanlariGetir();
                })
                .catch(err => console.log(err));
        }
    };

    if (!kullanici) return <div className="form-container"><p>Giriş yapmalısın!</p></div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
            <div className="profil-bilgi">
                <h2>👤 {kullanici.name}</h2>
                <p>📧 {kullanici.email}</p>
                <p>📦 {ilanlar.length} ilan</p>
            </div>

            <h3>İlanlarım</h3>
            {ilanlar.length === 0 ? (
                <p>Henüz ilan vermediniz.</p>
            ) : (
                <div className="ilanlar-grid">
                    {ilanlar.map(ilan => (
                        <div key={ilan.id} className="ilan-kart">
                            {ilan.image_url
                                ? <img src={ilan.image_url} alt={ilan.title} className="kart-img" />
                                : <div className="kart-img-placeholder">🏪</div>
                            }
                            <div className="kart-icerik">
                                <h3>{ilan.title}</h3>
                                <p className="ilan-fiyat">{Number(ilan.price).toLocaleString('tr-TR')} ₺</p>
                                <div className="kart-alt">
                                    <span className="ilan-konum">📍 {ilan.location}</span>
                                    <span className="ilan-kategori">{ilan.kategori}</span>
                                </div>
                                <div className="detay-butonlar">
                                    <button className="duzenle-btn" onClick={() => navigate(`/ilan-duzenle/${ilan.id}`)}>✏️ Düzenle</button>
                                    <button className="sil-btn" onClick={() => ilanSil(ilan.id)}>🗑️ Sil</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profil;