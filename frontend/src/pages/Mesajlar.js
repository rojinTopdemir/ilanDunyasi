import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Mesajlar({ kullanici }) {
    const [mesajlar, setMesajlar] = useState([]);
    const [seciliKisi, setSeciliKisi] = useState(null);
    const [konusma, setKonusma] = useState([]);
    const [yeniMesaj, setYeniMesaj] = useState('');

    useEffect(() => {
        if (!kullanici) return;
        axios.get(`https://ilandunyasi.onrender.com/api/messages/${kullanici.id}`)
            .then(res => setMesajlar(res.data))
            .catch(err => console.log(err));
    }, [kullanici]);

    const konusmaAc = (kisi_id, kisi_ad) => {
        setSeciliKisi({ id: kisi_id, name: kisi_ad });
        axios.get(`https://ilandunyasi.onrender.com/api/messages/konusma/${kullanici.id}/${kisi_id}`)
            .then(res => setKonusma(res.data))
            .catch(err => console.log(err));
    };

    const mesajGonder = () => {
        if (!yeniMesaj.trim()) return;
        axios.post('https://ilandunyasi.onrender.com/api/messages', {
            sender_id: kullanici.id,
            receiver_id: seciliKisi.id,
            content: yeniMesaj
        })
            .then(() => {
                setYeniMesaj('');
                konusmaAc(seciliKisi.id, seciliKisi.name);
            })
            .catch(err => console.log(err));
    };

    // Benzersiz kişileri çıkar
    const kisiler = [];
    const kisilerMap = {};
    mesajlar.forEach(m => {
        const diger = m.sender_id === kullanici.id ? { id: m.receiver_id, name: m.alici } : { id: m.sender_id, name: m.gonderen };
        if (!kisilerMap[diger.id]) {
            kisilerMap[diger.id] = true;
            kisiler.push(diger);
        }
    });

    if (!kullanici) return <div className="form-container"><p>Giriş yapmalısın!</p></div>;

    return (
        <div className="mesaj-container">
            <div className="mesaj-sol">
                <h3>Mesajlar</h3>
                {kisiler.length === 0 && <p className="bos-mesaj">Henüz mesajın yok.</p>}
                {kisiler.map(kisi => (
                    <div
                        key={kisi.id}
                        className={`kisi-kart ${seciliKisi?.id === kisi.id ? 'aktif' : ''}`}
                        onClick={() => konusmaAc(kisi.id, kisi.name)}
                    >
                        <div className="kisi-avatar">👤</div>
                        <span>{kisi.name}</span>
                    </div>
                ))}
            </div>

            <div className="mesaj-sag">
                {seciliKisi ? (
                    <>
                        <div className="konusma-baslik">💬 {seciliKisi.name}</div>
                        <div className="konusma-alan">
                            {konusma.map(m => (
                                <div key={m.id} className={`mesaj-balonu ${m.sender_id === kullanici.id ? 'benim' : 'onun'}`}>
                                    <p>{m.content}</p>
                                    <span>{new Date(m.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mesaj-input">
                            <input
                                value={yeniMesaj}
                                onChange={(e) => setYeniMesaj(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && mesajGonder()}
                                placeholder="Mesaj yaz..."
                            />
                            <button onClick={mesajGonder}>Gönder</button>
                        </div>
                    </>
                ) : (
                    <div className="konusma-bos">
                        <p>💬 Bir konuşma seç</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mesajlar;