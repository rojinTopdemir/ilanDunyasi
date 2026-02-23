# 🏪 İlanDünyası — Sahibinden Clone

Türkiye'nin popüler ilan sitesi Sahibinden.com'dan ilham alınarak geliştirilmiş, modern ve tam işlevsel bir ilan platformu.

---

## 🚀 Özellikler

- 👤 **Kullanıcı Sistemi** — Kayıt ol, giriş yap, profil sayfası
- 📋 **İlan Yönetimi** — İlan ekle, düzenle, sil
- 🖼️ **Fotoğraf Yükleme** — İlanlara fotoğraf ekle
- 🔍 **Arama & Filtreleme** — Başlığa veya kategoriye göre filtrele
- 💬 **Mesajlaşma** — Kullanıcılar arası anlık mesajlaşma
- ⚙️ **Admin Paneli** — Kullanıcı ve ilan yönetimi, istatistikler
- 📱 **Responsive Tasarım** — Mobil uyumlu arayüz

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
- React.js
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- Multer (dosya yükleme)
- JWT (kimlik doğrulama)
- Bcryptjs (şifre şifreleme)

### Veritabanı
- MySQL

---

## 📁 Proje Yapısı

```
sahibinden-clone/
├── backend/
│   ├── routes/
│   │   ├── listings.js
│   │   ├── auth.js
│   │   ├── messages.js
│   │   ├── admin.js
│   │   └── upload.js
│   ├── uploads/
│   ├── db.js
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── components/
        │   ├── IlanForm.js
        │   ├── Login.js
        │   └── Register.js
        ├── pages/
        │   ├── Anasayfa.js
        │   ├── IlanDetay.js
        │   ├── IlanVer.js
        │   ├── IlanDuzenle.js
        │   ├── Mesajlar.js
        │   ├── Profil.js
        │   └── Admin.js
        ├── App.js
        └── App.css
```

---

## ⚙️ Kurulum

### Gereksinimler
- Node.js
- MySQL
- Git

### 1. Repoyu klonla
```bash
git clone https://github.com/kullanici-adi/ilandunyasi.git
cd ilandunyasi
```

### 2. Backend kurulumu
```bash
cd backend
npm install
```

`.env` dosyası oluştur:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=şifren
DB_NAME=sahibinden_db
PORT=5000
```

### 3. Veritabanını oluştur
MySQL Workbench'te şunu çalıştır:
```sql
CREATE DATABASE sahibinden_db;
USE sahibinden_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_admin TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)
);

CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  location VARCHAR(255),
  image_url VARCHAR(500),
  user_id INT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  listing_id INT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

INSERT INTO categories (name, icon) VALUES
('Emlak', '🏠'), ('Vasıta', '🚗'), ('Elektronik', '📱'),
('Ev Eşyası', '🛋️'), ('Giyim', '👕');
```

### 4. Backend'i başlat
```bash
cd backend
npm run dev
```

### 5. Frontend kurulumu
```bash
cd frontend
npm install
npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/listings | Tüm ilanları getir |
| POST | /api/listings | Yeni ilan ekle |
| PUT | /api/listings/:id | İlan güncelle |
| DELETE | /api/listings/:id | İlan sil |
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| POST | /api/upload | Fotoğraf yükle |
| GET | /api/messages/:user_id | Mesajları getir |
| POST | /api/messages | Mesaj gönder |
| GET | /api/admin/stats | Admin istatistikleri |
| GET | /api/admin/users | Tüm kullanıcılar |
| GET | /api/admin/listings | Tüm ilanlar |

---

## 👤 Admin Paneli

Admin paneline erişmek için veritabanında kullanıcının `is_admin` alanını `1` yap:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'email@adresin.com';
```


---

## 🤝 Katkı

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir issue açınız.

---

## 📄 Lisans

MIT License

---

> Geliştirici: **[Rojin Topdemir]** — 2026
