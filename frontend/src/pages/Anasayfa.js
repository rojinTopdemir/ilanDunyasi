import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const kategoriler = [
    { id: 'hepsi', icon: '🏪', ad: 'Hepsi' },
    { id: 'Emlak', icon: '🏠', ad: 'Emlak' },
    { id: 'Vasıta', icon: '🚗', ad: 'Vasıta' },
    { id: 'Elektronik', icon: '📱', ad: 'Elektronik' },
    { id: 'Ev Eşyası', icon: '🛋️', ad: 'Ev Eşyası' },
    { id: 'Giyim', icon: '👕', ad: 'Giyim' },
];

function Anasayfa({ ilanlar, kullanici, ilanlariGetir }) {
    const [arama, setArama] = useState('');
    const [kategori, setKategori] = useState('hepsi');
    const navigate = useNavigate();

    const ilanSil = (e, id) => {
        e.stopPropagation();
        if (window.confirm('İlanı silmek istediğine emin misin?')) {
            axios.delete(`https://ilandunyasi.onrender.com/api/listings/${id}`)
                .then(() => ilanlariGetir())
                .catch(err => console.log(err));
        }
    };

    const filtreliIlanlar = ilanlar.filter(ilan => {
        const aramaUyuyor = ilan.title.toLowerCase().includes(arama.toLowerCase()) ||
            (ilan.description && ilan.description.toLowerCase().includes(arama.toLowerCase()));
        const kategoriUyuyor = kategori === 'hepsi' || ilan.kategori === kategori;
        return aramaUyuyor && kategoriUyuyor;
    });

    return (
        <div>
            {/* Kategori Kartları */}
            <div className="kategoriler">
                {kategoriler.map(k => (
                    <div
                        key={k.id}
                        className={`kategori-kart ${kategori === k.id ? 'aktif' : ''}`}
                        onClick={() => setKategori(k.id)}
                    >
                        <div className="icon">{k.icon}</div>
                        <p>{k.ad}</p>
                    </div>
                ))}
            </div>

            {/* Arama */}
            <div className="arama-bar">
                <input
                    type="text"
                    placeholder="🔍 İlan ara..."
                    value={arama}
                    onChange={(e) => setArama(e.target.value)}
                />
            </div>

            {/* İlanlar */}
            <p className="ilanlar-baslik">
                {filtreliIlanlar.length} ilan bulundu
            </p>

            {filtreliIlanlar.length === 0 ? (
                <p>İlan bulunamadı.</p>
            ) : (
                <div className="ilanlar-grid">
                    {filtreliIlanlar.map(ilan => (
                        <div key={ilan.id} className="ilan-kart" onClick={() => navigate(`/ilan/${ilan.id}`)}>
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
                                {kullanici && kullanici.id === ilan.user_id && (
                                    <button className="sil-btn" onClick={(e) => ilanSil(e, ilan.id)}>🗑️ Sil</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Anasayfa;