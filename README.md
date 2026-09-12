# 📊 Catatan Pengeluaran - Aplikasi Pencatatan Pengeluaran Pribadi

Aplikasi web sederhana untuk mencatat, memantau, dan merekap pengeluaran uang sehari-hari. Dibangun dengan HTML5, CSS3, dan JavaScript Vanilla tanpa backend atau database online.

## ✨ Fitur Utama

- ✅ **CRUD Lengkap**: Tambah, lihat, edit, dan hapus pengeluaran
- ✅ **Filter Canggih**: Cari berdasarkan nama, kategori, catatan, tanggal, dan nominal
- ✅ **Sorting**: Urutkan berdasarkan tanggal, nominal, atau nama
- ✅ **Ringkasan Otomatis**: Total, rata-rata, terbesar, dan jumlah transaksi
- ✅ **Export Excel**: Ekspor data ke file `.xlsx` dengan 2 sheet (Data & Ringkasan)
- ✅ **Backup & Restore**: Backup data ke JSON dan restore kapan saja
- ✅ **Responsive Design**: Berfungsi di desktop, tablet, dan smartphone
- ✅ **Local Storage**: Data tersimpan aman di browser Anda
- ✅ **Validasi Form**: Validasi input dengan pesan error yang jelas
- ✅ **Zero Dependencies**: Tidak memerlukan framework atau library besar (hanya SheetJS untuk Excel)

## 🚀 Cara Menjalankan Secara Lokal

### 1. Clone atau Download Repository
```bash
git clone <repository-url>
cd RekapPengeluaran
```

### 2. Buka File HTML
Cukup buka file `index.html` dengan browser favorit Anda:
- Klik dua kali file `index.html`, atau
- Drag `index.html` ke browser Anda, atau
- Gunakan localhost jika menggunakan web server lokal

**Catatan**: Aplikasi ini tidak memerlukan server backend. Buka langsung file `index.html` dengan browser.

### 3. Mulai Gunakan
- Isi form untuk menambah pengeluaran baru
- Gunakan filter untuk menemukan transaksi spesifik
- Edit atau hapus transaksi sesuai kebutuhan
- Export ke Excel atau backup data

## 📂 Struktur Project

```
RekapPengeluaran/
├── index.html          # File HTML utama
├── css/
│   └── style.css       # Styling dan responsive design
├── js/
│   └── script.js       # Semua logic aplikasi (CRUD, filter, dll)
└── README.md           # File dokumentasi ini
```

## 🌐 Deploy ke GitHub Pages

### 1. Buat Repository GitHub
- Buat repository baru dengan nama `RekapPengeluaran`
- Jangan initialize dengan README (opsional)

### 2. Upload Files
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/RekapPengeluaran.git
git push -u origin main
```

### 3. Aktifkan GitHub Pages
1. Buka Settings repository di GitHub
2. Scroll ke bagian "Pages"
3. Pilih branch `main` dan folder `root` (`/`)
4. Klik "Save"

### 4. Akses Aplikasi
Aplikasi akan tersedia di: `https://YOUR_USERNAME.github.io/RekapPengeluaran/`

## 📖 Cara Menggunakan Aplikasi

### Menambah Pengeluaran
1. Isi form "Tambah Pengeluaran":
   - **Tanggal**: Pilih tanggal transaksi (default: hari ini)
   - **Nama Pengeluaran**: Masukkan nama item (wajib diisi)
   - **Kategori**: Pilih kategori dari dropdown (wajib diisi)
   - **Jumlah**: Masukkan nominal uang (wajib diisi, harus > 0)
   - **Catatan**: Tambahkan catatan tambahan (opsional)
2. Klik tombol "+ Tambah Pengeluaran"
3. Data otomatis muncul di tabel dan tersimpan di browser

### Menggunakan Filter
- **Pencarian**: Cari berdasarkan nama, kategori, atau catatan (real-time)
- **Kategori**: Filter pengeluaran berdasarkan kategori tertentu
- **Rentang Tanggal**: Filter berdasarkan "Dari Tanggal" dan "Sampai Tanggal"
- **Rentang Nominal**: Filter berdasarkan nominal minimal dan maksimal
- **Sorting**: Urutkan data berdasarkan:
  - Terbaru / Terlama
  - Nominal Terbesar / Terkecil
  - Nama A-Z / Z-A

Semua filter dapat digunakan secara bersamaan. Ringkasan otomatis akan berubah sesuai data yang ditampilkan.

### Mengedit Pengeluaran
1. Klik tombol "✎ Edit" pada transaksi yang ingin diubah
2. Form akan terisi otomatis dengan data lama
3. Ubah data sesuai kebutuhan
4. Klik "✓ Simpan Perubahan" atau "Batal" untuk membatalkan

### Menghapus Pengeluaran
1. Klik tombol "🗑️ Hapus" pada transaksi
2. Konfirmasi dengan klik "Lanjutkan"
3. Data akan dihapus dan tabel terupdate

### Export ke Excel
1. (Opsional) Gunakan filter untuk memilih data yang ingin diexport
2. Klik tombol "📊 Export Excel"
3. File `.xlsx` akan otomatis diunduh dengan nama `pengeluaran-YYYY-MM-DD.xlsx`
4. File berisi 2 sheet:
   - **Data**: Daftar transaksi dengan kolom Tanggal, Pengeluaran, Kategori, Jumlah, Catatan
   - **Ringkasan**: Statistik total, rata-rata, terbesar, jumlah transaksi

### Backup Data
1. Klik tombol "💾 Backup Data"
2. File JSON akan diunduh dengan nama `pengeluaran-backup-YYYY-MM-DD.json`
3. Simpan file di tempat yang aman

### Restore Data
1. Klik tombol "📂 Restore Data"
2. Pilih file backup `.json` yang sudah dibuat sebelumnya
3. Konfirmasi restore
4. Data akan dipulihkan ke browser

### Isi Data Contoh
1. Klik tombol "📋 Isi Data Contoh"
2. Aplikasi akan menambahkan 8 transaksi contoh untuk testing
3. Gunakan data ini untuk menguji fitur filter, sorting, dan export

### Hapus Semua Data
1. Klik tombol "🗑️ Hapus Semua Data"
2. Baca peringatan dengan seksama
3. Pastikan Anda sudah melakukan backup
4. Konfirmasi dengan klik "Lanjutkan"
5. Semua data akan dihapus permanen (dari browser saat ini saja)

## 💾 Data & Penyimpanan

### Bagaimana Data Disimpan?
- Data disimpan di **localStorage browser** Anda, bukan di server
- Setiap browser/device menyimpan data yang terpisah
- Data tersimpan dalam format JSON dengan struktur:

```javascript
[
  {
    id: "unique-id",
    date: "2026-09-12",
    name: "Makan siang",
    category: "Makanan",
    amount: 25000,
    note: "Nasi ayam",
    createdAt: "2026-09-12T08:00:00Z"
  }
]
```

### Kapan Data Hilang?
Data akan hilang jika Anda:
1. **Menghapus cache/cookies browser** → Data di localStorage hilang
2. **Menggunakan private/incognito mode** → Data tidak disimpan permanen
3. **Menghapus aplikasi/browser** → Data hilang
4. **Klik tombol "Hapus Semua Data"** → Dihapus permanen

### ⚠️ PENTING: Backup Rutin!
Karena data hanya tersimpan lokal, **lakukan backup secara berkala**:
- Gunakan fitur "💾 Backup Data" setiap bulan
- Simpan file backup di cloud (Google Drive, OneDrive, Dropbox, dll)
- Jika data hilang, Anda dapat restore dari file backup

## 🔒 Privasi & Keamanan

### Privasi Data Anda
- ✅ **Data tidak dikirim ke server** - Semua data disimpan lokal di browser
- ✅ **Tanpa analytics/tracking** - Tidak ada pengumpulan data
- ✅ **Tanpa login/register** - Aplikasi fully offline
- ✅ **Tanpa internet** - Bisa digunakan tanpa koneksi internet (setelah pertama kali load)

### Keamanan Data
- Data hanya dapat diakses oleh Anda di browser yang sama
- File backup (.json) hanya dapat diakses jika ada di device Anda
- Jangan bagikan file backup ke orang lain

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur dan semantic markup
- **CSS3** - Styling dan responsive design
- **JavaScript Vanilla** - Logic aplikasi (tanpa framework)
- **SheetJS (XLSX)** - Export ke Excel (CDN)
- **LocalStorage API** - Penyimpanan data lokal

## 📊 Format Rupiah

Aplikasi menggunakan format Rupiah Indonesia:
- `Rp25.000` → Dua puluh lima ribu
- `Rp100.000` → Seratus ribu
- `Rp1.500.000` → Satu juta lima ratus ribu

Untuk perhitungan internal, nominal disimpan sebagai angka:
- `25000` (bukan `"Rp25.000"`)

## 🎨 Tampilan & Responsive Design

### Desktop (Lebar > 1024px)
- Layout 4 kolom untuk summary cards
- Form dan filter dalam grid responsif
- Tabel dengan scroll horizontal jika perlu

### Tablet (768px - 1024px)
- Layout 2 kolom untuk summary cards
- Form dan filter dalam grid 1-2 kolom
- Tabel dengan scroll horizontal

### Smartphone (< 768px)
- Layout 1 kolom untuk semua elemen
- Form menjadi satu kolom
- Tabel dengan horizontal scrolling
- Tombol dan input ukuran optimal untuk mobile

## ⌨️ Keyboard Navigation

- **Tab** - Navigasi antar form input
- **Enter** - Submit form
- **Escape** - Batal edit (jika ditambahkan fitur ini)

## 🐛 Troubleshooting

### Data Tidak Tersimpan
1. Buka DevTools (F12) → Console
2. Ketik: `localStorage.getItem('expenseTrackerData')`
3. Jika hasilnya `null`, coba tambah data lagi
4. Periksa apakah browser mengizinkan localStorage

### Data Hilang Setelah Restart Browser
- Normal! Jika menggunakan private/incognito mode, data tidak disimpan
- Gunakan mode normal (non-private) dan backup data Anda

### File Excel Tidak Bisa Dibuka
- Pastikan file Excel sudah selesai diunduh
- Coba buka dengan Excel, Google Sheets, atau LibreOffice
- Jika error, reload halaman dan coba export lagi

### File Backup Tidak Bisa Direstore
- Pastikan file JSON belum dimodifikasi atau rusak
- Cek bahwa file berisi array JSON yang valid
- Coba buka file dengan text editor untuk verifikasi format

## 📋 Checklist Fitur

- ✅ Web satu halaman (single page)
- ✅ Tidak membutuhkan login/register
- ✅ Tidak menggunakan backend/server
- ✅ Data di localStorage
- ✅ CREATE - Tambah pengeluaran
- ✅ READ - Lihat semua pengeluaran
- ✅ UPDATE - Edit pengeluaran
- ✅ DELETE - Hapus pengeluaran
- ✅ Filter (pencarian, kategori, tanggal, nominal)
- ✅ Sorting (6 opsi)
- ✅ Summary/Ringkasan otomatis
- ✅ Export Excel (2 sheet)
- ✅ Backup & Restore JSON
- ✅ Hapus semua data
- ✅ Format Rupiah Indonesia
- ✅ Validasi form
- ✅ Empty state message
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ GitHub Pages compatible
- ✅ Tidak ada dependency besar
- ✅ Aksesibilitas dasar

## 💡 Tips & Trik

1. **Backup mingguan**: Buat backup setiap minggu dan simpan di cloud
2. **Kategorisasi konsisten**: Gunakan kategori yang sama untuk memudahkan analisis
3. **Catatan detail**: Tuliskan catatan yang jelas untuk referensi di masa depan
4. **Export bulanan**: Export ke Excel setiap akhir bulan untuk filing
5. **Test filter**: Gunakan filter untuk memahami pola pengeluaran Anda

## 🤝 Kontribusi

Jika menemukan bug atau punya saran fitur, silakan buat issue di GitHub.

## 📄 Lisensi

Project ini tersedia di bawah lisensi MIT. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini.

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi di atas
2. Buka DevTools (F12) dan lihat console untuk error messages
3. Coba refresh halaman
4. Coba clear cache browser

---

**Catatan Penting**: 
💡 Data Anda disimpan secara lokal di browser ini dan tidak dikirim ke server. 
⚠️ Disarankan melakukan backup secara berkala untuk mencegah kehilangan data.
→ Jika browser atau site data dihapus, data Anda akan hilang permanen kecuali ada backup.

Selamat menggunakan! 🎉
"# PengeluaranUang1" 
