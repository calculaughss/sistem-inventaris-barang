// node scripts/export-csv.js -> public/data/*.csv (bisa dibuka di Excel / dipakai untuk analisis)
const fs = require("fs");
const { barang, perawatan } = require("../prisma/data");
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
const csv = (rows) => [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map(esc).join(","))].join("\n");
fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/barang.csv", csv(barang));
fs.writeFileSync("public/data/perawatan.csv", csv(perawatan.map((p) => ({ ...p, tanggal: p.tanggal.toISOString().slice(0, 10) }))));
console.log("CSV dibuat:", barang.length, "barang,", perawatan.length, "perawatan");
