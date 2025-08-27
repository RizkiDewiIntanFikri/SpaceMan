# SpaceMan Authentication System

## Overview
Sistem autentikasi SpaceMan telah diintegrasikan untuk menghubungkan halaman registrasi dengan dashboard utama.

## Fitur yang Tersedia

### 1. Halaman Registrasi (`/register`)
- Form registrasi sederhana dengan username
- Validasi input dan error handling
- Redirect otomatis ke dashboard setelah registrasi berhasil

### 2. Dashboard Terproteksi
- Hanya dapat diakses setelah login
- Menampilkan informasi user (username, cash balance, portfolio value)
- Tombol logout di header

### 3. Sistem Autentikasi
- Token-based authentication
- Data user disimpan di localStorage
- Auto-redirect berdasarkan status autentikasi

## Flow Aplikasi

```
1. User membuka aplikasi
   ↓
2. Jika belum login → Tampilkan halaman Register
   ↓
3. User mengisi username dan submit
   ↓
4. Backend memproses registrasi
   ↓
5. Jika berhasil → Redirect ke Dashboard
   ↓
6. Dashboard menampilkan data user
   ↓
7. User dapat logout → Kembali ke Register
```

## Komponen yang Dimodifikasi

### App.jsx
- Menambahkan state autentikasi
- Conditional rendering untuk Register/Dashboard
- Handler untuk registrasi dan logout

### Layout.jsx
- Menerima props `onLogout` dan `user`
- Pass down ke Header component

### Header.jsx
- Menampilkan username
- Tombol logout dengan styling

### Dashboard.jsx
- Welcome message dengan nama user
- Informasi cash balance dan portfolio value
- Data user dari localStorage

## Cara Penggunaan

### Untuk User Baru:
1. Buka aplikasi di browser
2. Halaman registrasi akan muncul otomatis
3. Masukkan username yang diinginkan
4. Klik "Get Started"
5. Akan diarahkan ke dashboard

### Untuk User yang Sudah Login:
1. Aplikasi akan langsung menampilkan dashboard
2. Username dan informasi user ditampilkan di header
3. Dapat mengakses semua fitur trading

### Untuk Logout:
1. Klik tombol logout di header (ikon LogOut)
2. Akan kembali ke halaman registrasi
3. Data user dihapus dari localStorage

## Keamanan

- Token autentikasi disimpan di localStorage
- Semua route dashboard terproteksi
- Logout membersihkan semua data autentikasi
- Socket.io authentication dengan token

## Troubleshooting

### Jika Dashboard tidak muncul:
- Periksa localStorage untuk token dan user data
- Pastikan backend berjalan di port 3000
- Check console browser untuk error

### Jika Registrasi gagal:
- Periksa koneksi internet
- Pastikan username tidak kosong
- Username harus unik (tidak boleh duplikat)

## File yang Terlibat

- `src/App.jsx` - Main routing dan auth logic
- `src/layouts/Layout.jsx` - Layout wrapper
- `src/components/common/Header.jsx` - Header dengan user info
- `src/pages/Register.jsx` - Halaman registrasi
- `src/pages/Dashboard.jsx` - Dashboard utama
- `src/main.jsx` - Entry point aplikasi

