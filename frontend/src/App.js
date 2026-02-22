import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Anasayfa from './pages/Anasayfa';
import IlanVer from './pages/IlanVer';
import IlanDetay from './pages/IlanDetay';
import IlanDuzenle from './pages/IlanDuzenle';
import Profil from './pages/Profil';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import Mesajlar from './pages/Mesajlar';
import Admin from './pages/Admin';

function AppIcerigi() {
  const [ilanlar, setIlanlar] = useState([]);
  const [kullanici, setKullanici] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const kayitliKullanici = localStorage.getItem('kullanici');
    if (kayitliKullanici) setKullanici(JSON.parse(kayitliKullanici));
    ilanlariGetir();
  }, []);

  const ilanlariGetir = () => {
    axios.get('https://ilandunyasi.onrender.com/api/listings')
      .then(res => setIlanlar(res.data))
      .catch(err => console.log(err));
  };

  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    setKullanici(null);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🏪 <span style={{ color: '#4f46e5' }}>İlan</span>Dünyası
        </h1>
        <nav>
          {kullanici?.is_admin ? (
            <button onClick={() => navigate('/admin')}>⚙️ Admin</button>
          ) : null}
          {kullanici ? (
            <>
              <span onClick={() => navigate('/profil')}>👤 {kullanici.name}</span>
              <button onClick={() => navigate('/mesajlar')}>💬 Mesajlar</button>
              <button onClick={() => navigate('/ilan-ver')}>İlan Ver</button>
              <button onClick={cikisYap}>Çıkış</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/giris')}>Giriş Yap</button>
              <button onClick={() => navigate('/mesajlar')}>💬 Mesajlar</button>
              <button onClick={() => navigate('/kayit')}>Kayıt Ol</button>
            </>
          )}
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '30px auto', padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<Anasayfa ilanlar={ilanlar} kullanici={kullanici} ilanlariGetir={ilanlariGetir} />} />
          <Route path="/ilan-ver" element={<IlanVer kullanici={kullanici} ilanlariGetir={ilanlariGetir} />} />
          <Route path="/ilan/:id" element={<IlanDetay kullanici={kullanici} ilanlariGetir={ilanlariGetir} />} />
          <Route path="/ilan-duzenle/:id" element={<IlanDuzenle kullanici={kullanici} ilanlariGetir={ilanlariGetir} />} />
          <Route path="/profil" element={<Profil kullanici={kullanici} ilanlariGetir={ilanlariGetir} />} />
          <Route path="/giris" element={<Login onGirisYapildi={(k) => { setKullanici(k); navigate('/'); }} sayfaDegistir={(s) => navigate(s === 'register' ? '/kayit' : '/giris')} />} />
          <Route path="/mesajlar" element={<Mesajlar kullanici={kullanici} />} />
          <Route path="/admin" element={<Admin kullanici={kullanici} />} />
          <Route path="/kayit" element={<Register sayfaDegistir={(s) => navigate(s === 'login' ? '/giris' : '/kayit')} />} />
        </Routes>
      </main>

      <footer>
        <p>© 2026 <span>İlanDünyası</span> — Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppIcerigi />
    </BrowserRouter>
  );
}

export default App;