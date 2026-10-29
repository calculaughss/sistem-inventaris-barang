// Generator data dummy (deterministik): 100 barang + 90 catatan perawatan
// [nama, kategori, lokasi, harga satuan, maks jumlah]
const base = [
  ["PC Desktop", "Elektronik & TIK", "Lab Komputer", 6500000, 20],
  ["Laptop", "Elektronik & TIK", "Ruang Guru", 7800000, 5],
  ["Proyektor LCD", "Elektronik & TIK", "Ruang Kelas", 4500000, 3],
  ["Printer", "Elektronik & TIK", "Ruang TU", 1900000, 2],
  ["Router WiFi", "Elektronik & TIK", "Lab Komputer", 850000, 4],
  ["Canting Batik Tulis", "Peralatan Batik", "Workshop Batik", 35000, 60],
  ["Wajan Lilin Malam", "Peralatan Batik", "Workshop Batik", 120000, 15],
  ["Kompor Batik Listrik", "Peralatan Batik", "Workshop Batik", 250000, 20],
  ["Cap Batik Tembaga", "Peralatan Batik", "Workshop Batik", 450000, 12],
  ["Gawangan Kayu", "Peralatan Batik", "Workshop Batik", 150000, 30],
  ["Meja Siswa", "Mebel", "Ruang Kelas", 350000, 40],
  ["Kursi Siswa", "Mebel", "Ruang Kelas", 200000, 40],
  ["Lemari Arsip", "Mebel", "Ruang TU", 1500000, 4],
  ["Papan Tulis Whiteboard", "Mebel", "Ruang Kelas", 600000, 6],
  ["Meja Guru", "Mebel", "Ruang Guru", 750000, 8],
  ["Mikroskop", "Laboratorium", "Lab IPA", 2800000, 6],
  ["Timbangan Digital", "Laboratorium", "Lab IPA", 650000, 4],
  ["Bola Voli", "Olahraga", "Gudang Olahraga", 250000, 10],
  ["Bola Basket", "Olahraga", "Gudang Olahraga", 300000, 10],
  ["Matras Senam", "Olahraga", "Gudang Olahraga", 550000, 8],
  ["Buku Paket Pelajaran", "Perpustakaan", "Perpustakaan", 95000, 50],
  ["Rak Buku", "Perpustakaan", "Perpustakaan", 1200000, 5],
  ["Mesin Jahit", "Peralatan Batik", "Ruang Praktik Busana", 2400000, 10],
  ["AC Split 1 PK", "Elektronik & TIK", "Ruang Kepala Sekolah", 3800000, 3],
  ["Mesin Fotokopi", "Elektronik & TIK", "Ruang TU", 12000000, 1],
];
let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
const pick = (a) => a[Math.floor(rnd() * a.length)];

const barang = Array.from({ length: 100 }, (_, i) => {
  const b = base[i % base.length], v = Math.floor(i / base.length) + 1, r = rnd(), d = rnd();
  return {
    kode: `INV-${String(i + 1).padStart(3, "0")}`,
    nama: `${b[0]} Tipe ${String.fromCharCode(64 + v)}`,
    kategori: b[1], lokasi: b[2],
    jumlah: 1 + Math.floor(rnd() * b[4]),
    kondisi: r < 0.55 ? "Baik" : r < 0.82 ? "Rusak Ringan" : "Rusak Berat",
    tahun: 2016 + Math.floor(rnd() * 10),
    harga: Math.round((b[3] * (0.9 + rnd() * 0.2)) / 1000) * 1000,
    sumberDana: d < 0.45 ? "BOS" : d < 0.7 ? "APBD Provinsi" : d < 0.88 ? "Komite Sekolah" : "Hibah / CSR",
  };
});

const JENIS = { "Servis Rutin": [50, 400], Perbaikan: [150, 1500], "Penggantian Komponen": [300, 3000] };
const perawatan = Array.from({ length: 90 }, () => {
  const b = pick(rnd() < 0.7 ? barang.filter((x) => x.kondisi !== "Baik") : barang);
  const j = pick(Object.keys(JENIS)), [lo, hi] = JENIS[j];
  return {
    kode: b.kode,
    tanggal: new Date(Date.UTC(2025, 10 + Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 27))),
    jenis: j,
    biaya: Math.round(((lo + rnd() * (hi - lo)) * 1000) / 5000) * 5000,
    keterangan: `${j} ${b.nama}`,
  };
}).sort((a, b) => a.tanggal - b.tanggal);

module.exports = { barang, perawatan };
