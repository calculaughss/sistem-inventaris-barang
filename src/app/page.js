import prisma from "@/lib/prisma";
import Link from "next/link";
import { Donut, Legend, AreaChart, Bars } from "@/components/charts";
export const dynamic = "force-dynamic";

const NOW = new Date().getFullYear();
const KC = { Baik: "#2e8b57", "Rusak Ringan": "#d98a00", "Rusak Berat": "#c0392b" };
const cls = { Baik: "ok", "Rusak Ringan": "warn", "Rusak Berat": "bad" };
const PAL = ["#1f2a5c", "#c8962e", "#6c5ce7", "#0984e3", "#2e8b57", "#c0392b"];
const rp = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
const jt = (n) => n >= 1e9 ? (n / 1e9).toFixed(1).replace(".", ",") + " M" : n >= 1e6 ? Math.round(n / 1e6) + " jt" : Math.round(n / 1e3) + " rb";
const sum = (a, f) => a.reduce((x, y) => x + f(y), 0);
const group = (a, f) => a.reduce((m, x) => ((m[f(x)] ??= []).push(x), m), {});
const nilai = (b) => b.jumlah * b.harga;
const buku = (b) => nilai(b) * Math.max(0.1, 1 - (NOW - b.tahun) / 8); // penyusutan garis lurus 8 th, residu 10%

export default async function Home({ searchParams }) {
  const [ALL, P0] = await Promise.all([prisma.barang.findMany(), prisma.perawatan.findMany({ orderBy: { tanggal: "asc" } })]);
  if (!ALL.length) return (
    <div className="card empty"><h3>Database masih kosong</h3><p>Jalankan <code>npx prisma db push</code> lalu <code>npm run seed</code>, kemudian refresh halaman ini.</p></div>
  );
  const kategoriList = [...new Set(ALL.map((b) => b.kategori))];
  const kf = kategoriList.includes(searchParams.kategori) ? searchParams.kategori : "";
  const B = kf ? ALL.filter((b) => b.kategori === kf) : ALL;
  const ids = new Set(B.map((b) => b.id)), P = P0.filter((p) => ids.has(p.barangId));
  const unit = sum(B, (b) => b.jumlah), totalNilai = sum(B, nilai), totalBuku = sum(B, buku);
  const pctBaik = Math.round((sum(B.filter((b) => b.kondisi === "Baik"), (b) => b.jumlah) / unit) * 100);
  const umurRata = sum(B, (b) => NOW - b.tahun) / B.length, tua = B.filter((b) => NOW - b.tahun >= 8);

  const th = group(B, (b) => b.tahun);
  const tren = Object.keys(th).sort().map((y) => ({ label: y, value: sum(th[y], nilai) }));
  const kondisi = ["Baik", "Rusak Ringan", "Rusak Berat"].map((k) => ({ label: k, color: KC[k], value: sum(B.filter((b) => b.kondisi === k), (b) => b.jumlah) }));
  const kat = Object.entries(group(B, (b) => b.kategori)).map(([nama, items]) => ({
    nama, items, nilai: sum(items, nilai), unit: sum(items, (b) => b.jumlah),
    rasio: Math.round((items.filter((b) => b.kondisi !== "Baik").length / items.length) * 100),
  })).sort((a, b) => b.nilai - a.nilai);
  const dana = Object.entries(group(B, (b) => b.sumberDana)).map(([label, it], i) => ({ label, value: sum(it, nilai), color: PAL[i] })).sort((a, b) => b.value - a.value);
  const lokasi = Object.entries(group(B, (b) => b.lokasi)).map(([nama, it]) => ({
    nama, jenis: it.length, skor: Math.round((sum(it.filter((b) => b.kondisi === "Baik"), (b) => b.jumlah) / sum(it, (b) => b.jumlah)) * 100),
  })).sort((a, b) => a.skor - b.skor).slice(0, 7);

  const last = P.length ? P[P.length - 1].tanggal : new Date();
  const bulan = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth() - 11 + i, 1)));
  const biayaBulan = bulan.map((d) => ({
    label: d.toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" }),
    value: sum(P.filter((p) => p.tanggal.getUTCFullYear() === d.getUTCFullYear() && p.tanggal.getUTCMonth() === d.getUTCMonth()), (p) => p.biaya),
  }));
  const biayaTotal = sum(P, (p) => p.biaya);
  const jenisP = Object.entries(group(P, (p) => p.jenis)).map(([j, it]) => ({ j, n: it.length, b: sum(it, (p) => p.biaya) })).sort((a, b) => b.b - a.b);

  const prioritas = B.filter((b) => b.kondisi === "Rusak Berat").sort((a, b) => nilai(b) - nilai(a)).slice(0, 5);
  const termahal = [...B].sort((a, b) => nilai(b) - nilai(a)).slice(0, 5);
  const worst = [...kat].sort((a, b) => b.rasio - a.rasio)[0];
  const insights = [
    `Kategori ${kat[0].nama} menguasai ${Math.round((kat[0].nilai / totalNilai) * 100)}% nilai aset (${jt(kat[0].nilai)}).`,
    `Rasio kerusakan tertinggi ada di ${worst.nama}: ${worst.rasio}% jenis barangnya tidak berkondisi baik.`,
    `Rata-rata umur aset ${umurRata.toFixed(1)} tahun; ${tua.length} jenis barang sudah berumur ≥ 8 tahun.`,
    `Biaya perawatan 12 bulan terakhir ${jt(biayaTotal)}; terbesar dari ${jenisP[0]?.j} (${jt(jenisP[0]?.b || 0)}).`,
    `Sumber dana dominan: ${dana[0].label} (${Math.round((dana[0].value / totalNilai) * 100)}% dari total nilai).`,
  ];
  const kpis = [
    ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9.5c0-1-1.1-1.5-2.5-1.5s-2.5.5-2.5 1.5 1.1 1.5 2.5 1.5 2.5.5 2.5 1.5-1.1 1.5-2.5 1.5-2.5-.5-2.5-1.5M12 6.5V8M12 16v1.5", "Nilai Perolehan", jt(totalNilai), `Nilai buku ${jt(totalBuku)} (${Math.round((totalBuku / totalNilai) * 100)}%)`],
    ["M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8", "Total Unit", unit.toLocaleString("id-ID"), `${B.length} jenis · ${kat.length} kategori`],
    ["M22 12h-4l-3 9L9 3l-3 9H2", "Kesehatan Aset", pctBaik + "%", "unit berkondisi baik"],
    ["M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z", "Biaya Perawatan", jt(biayaTotal), `${P.length} tindakan / 12 bln`],
    ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2", "Umur Rata-rata", umurRata.toFixed(1) + " th", `${tua.length} aset ≥ 8 tahun`],
  ];

  return (
    <>
      <div className="pagehead"><div><h1>Ringkasan Inventaris</h1><p>{new Date().toLocaleDateString("id-ID", { dateStyle: "full" })} · {kf || "Semua kategori"}</p></div>
        <div className="hbtns"><a className="btn ghost" href="/data/barang.csv" download>Unduh barang.csv</a><a className="btn ghost" href="/data/perawatan.csv" download>Unduh perawatan.csv</a></div></div>
      <div className="chips"><Link href="/" className={!kf ? "on" : ""}>Semua</Link>{kategoriList.map((k) => <Link key={k} href={"/?kategori=" + encodeURIComponent(k)} className={kf === k ? "on" : ""}>{k}</Link>)}</div>

      <div className="kpis">{kpis.map(([i, l, v, s]) => <div className="card kpi" key={l}><span className="kicon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={i} /></svg></span><small>{l}</small><b>{v}</b><em>{s}</em></div>)}</div>
      <div className="card insight-card"><h3>Insight Utama</h3><ul>{insights.map((t) => <li key={t}><i /><p>{t}</p></li>)}</ul></div>

      <div className="g21">
        <div className="card"><h3>Tren Nilai Perolehan per Tahun</h3><AreaChart data={tren} fmt={jt} /></div>
        <div className="card"><h3>Kondisi Barang (unit)</h3><Donut data={kondisi} center={[pctBaik + "%", "kondisi baik"]} /><Legend data={kondisi} /></div>
      </div>

      <div className="card scroll"><h3>Analisis per Kategori</h3>
        <table><thead><tr><th>Kategori</th><th>Nilai Aset</th><th>Unit</th><th>Komposisi Kondisi (jenis)</th><th>% Bermasalah</th></tr></thead><tbody>
          {kat.map((k) => <tr key={k.nama}><td><b>{k.nama}</b></td><td>{jt(k.nilai)}</td><td>{k.unit}</td>
            <td style={{ minWidth: 200 }}><div className="stack">{Object.keys(KC).map((c) => { const n = k.items.filter((b) => b.kondisi === c).length; return n ? <i key={c} title={`${c}: ${n}`} style={{ width: (n / k.items.length) * 100 + "%", background: KC[c] }} /> : null; })}</div></td>
            <td><span className={"badge " + (k.rasio > 50 ? "bad" : k.rasio > 35 ? "warn" : "ok")}>{k.rasio}%</span></td></tr>)}
        </tbody></table></div>

      <div className="g21">
        <div className="card"><h3>Biaya Perawatan per Bulan <small>(12 bulan terakhir)</small></h3><Bars data={biayaBulan} fmt={jt} /></div>
        <div className="card"><h3>Sumber Dana (nilai aset)</h3><Donut data={dana} center={[jt(totalNilai), "total nilai"]} /><Legend data={dana} fmt={jt} /></div>
      </div>

      <div className="grid2">
        <div className="card"><h3>Lokasi Paling Perlu Perhatian</h3><p className="note">Skor = % unit berkondisi baik (terendah di atas)</p>
          {lokasi.map((l) => <div className="row" key={l.nama}><div className="lbl"><span>{l.nama}</span><b>{l.skor}%</b></div><div className="track"><i style={{ width: l.skor + "%", background: l.skor < 50 ? KC["Rusak Berat"] : l.skor < 70 ? KC["Rusak Ringan"] : KC.Baik }} /></div></div>)}</div>
        <div className="card scroll"><h3>Prioritas Penggantian <small>(Rusak Berat, nilai terbesar)</small></h3>
          <table><thead><tr><th>Barang</th><th>Umur</th><th>Nilai Buku</th></tr></thead><tbody>
            {prioritas.map((b) => <tr key={b.id}><td><b>{b.nama}</b><br /><small className="note">{b.kode} · {b.lokasi}</small></td><td>{NOW - b.tahun} th</td><td>{jt(buku(b))}</td></tr>)}</tbody></table>
          <h3 style={{ marginTop: 18 }}>Jenis Perawatan</h3>
          {jenisP.map((j) => <div className="lbl" key={j.j}><span>{j.j} <small className="note">({j.n}×)</small></span><b>{jt(j.b)}</b></div>)}</div>
      </div>

      <div className="card scroll"><h3>5 Aset Bernilai Tertinggi</h3>
        <table><thead><tr><th>Kode</th><th>Nama</th><th>Jumlah</th><th>Total Nilai</th><th>Kondisi</th></tr></thead><tbody>
          {termahal.map((b) => <tr key={b.id}><td>{b.kode}</td><td><b>{b.nama}</b></td><td>{b.jumlah}</td><td>{rp(nilai(b))}</td><td><span className={"badge " + cls[b.kondisi]}>{b.kondisi}</span></td></tr>)}</tbody></table></div>
    </>
  );
}