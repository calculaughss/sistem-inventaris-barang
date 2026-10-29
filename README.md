# Inventaris SMK Mitra Batik Tasikmalaya
Next.js 14 (App Router) + Prisma + SQLite. Dashboard analitik dengan grafik SVG (tanpa library chart).

    npm install
    npx prisma db push --force-reset   # skema berubah: reset database lama
    npm run seed                       # 100 barang + 90 catatan perawatan
    npm run dev                        # http://localhost:3000

## Data dummy
- `public/data/barang.csv` (100 baris) dan `public/data/perawatan.csv` (90 baris) — siap dibuka di Excel/Google Sheets/Python.
- Sumber data: `prisma/data.js` (deterministik). Regenerasi CSV: `npm run export:csv`.
- Kolom barang: kode, nama, kategori, lokasi, jumlah, kondisi, tahun, harga, sumberDana.
- Nilai buku dihitung penyusutan garis lurus 8 tahun, nilai residu 10%.
