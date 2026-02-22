import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function IlanDetay({ kullanici, ilanlariGetir }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ilan, setIlan] = useState(null);
    const [mesajFormu, setMesajFormu] = useState(false);
    const [mesajIcerik, setMesajIcerik] = useState('');

    useEffect(() => {
        axios.get(`https://ilandunyasi.onrender.com/api/listings/${id}`)
            .then(res => setIlan(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const ilanSil = () => {
        if (window.confirm('İlanı silmek istediğine emin misin?')) {
            axios.delete(`https://ilandunyasi.onrender.com/api/listings/${id}`)
                .then(() => {
                    ilanlariGetir();
                    navigate('/');
                })
                .catch(err => console.log(err));
        }
    };

    if (!ilan) return <p>Yükleniyor...</p>;

    return (
        <div className="detay-container">
            <button className="geri-btn" onClick={() => navigate('/')}>← Geri</button>
            {ilan.image_url && <img src={ilan.image_url} alt={ilan.title} className="detay-img" />}
            <h2>{ilan.title}</h2>
            <p className="detay-fiyat">{ilan.price} ₺</p>
            <p className="detay-konum">📍 {ilan.location}</p>
            <p className="detay-aciklama">{ilan.description}</p>
            <p className="detay-kullanici">👤 {ilan.kullanici}</p>
            <p className="detay-tarih">📅 {new Date(ilan.created_at).toLocaleDateString('tr-TR')}</p>

            {kullanici && kullanici.id === ilan.user_id && (
                <div className="detay-butonlar">
                    <button className="duzenle-btn" onClick={() => navigate(`/ilan-duzenle/${ilan.id}`)}>✏️ Düzenle</button>
                    <button className="sil-btn" onClick={ilanSil}>🗑️ Sil</button>
                </div>

            )}
            {kullanici && kullanici.id !== ilan.user_id && (
                <div style={{ marginTop: '20px' }}>
                    {!mesajFormu ? (
                        <button className="duzenle-btn" onClick={() => setMesajFormu(true)}>💬 Mesaj Gönder</button>
                    ) : (
                        <div>
                            <textarea
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e7eb', marginBottom: '10px', height: '100px', outline: 'none' }}
                                placeholder="Mesajınızı yazın..."
                                value={mesajIcerik}
                                onChange={(e) => setMesajIcerik(e.target.value)}
                            />
                            <button className="duzenle-btn" onClick={() => {
                                axios.post('https://ilandunyasi.onrender.com/api/messages', {
                                    sender_id: kullanici.id,
                                    receiver_id: ilan.user_id,
                                    listing_id: ilan.id,
                                    content: mesajIcerik
                                }).then(() => {
                                    alert('Mesaj gönderildi! 🎉');
                                    setMesajFormu(false);
                                    setMesajIcerik('');
                                }).catch(err => console.log(err));
                            }}>Gönder</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default IlanDetay;