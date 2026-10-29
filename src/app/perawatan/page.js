import prisma from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const JENIS = ["Servis Rutin", "Perbaikan", "Penggantian Komponen"];

export default async function Perawatan({ searchParams }) {
  const jenis = JENIS.includes(searchParams.jenis) ? searchParams.jenis : "";
  const where = jenis ? { jenis } : {};
  const [rows, agg] = await Promise.all([
    prisma.perawatan.findMany({ where, include: { barang: true }, orderBy: { tanggal: "desc" }, take: 50 }),
    prisma.perawatan.aggregate({ where, _sum: { biaya: true }, _count: true, _avg: { biaya: true } }),
  ]);
  const stats = [["Total Biaya", rp(agg._sum.biaya || 0)], ["Jumlah Tindakan", agg._count], ["Rata-rata / Tindakan", rp(Math.round(agg._avg.biaya || 0))]];
  return (
    <>
      <div className="pagehead"><div><h1>Riwayat Perawatan</h1><p>Servis, perbaikan, dan penggantian komponen barang</p></div>
        <a className="btn ghost" href="/data/perawatan.csv" download>Unduh CSV</a></div>
      <div className="chips"><Link href="/perawatan" className={!jenis ? "on" : ""}>Semua</Link>{JENIS.map((j) => <Link key={j} href={"/perawatan?jenis=" + encodeURIComponent(j)} className={jenis === j ? "on" : ""}>{j}</Link>)}</div>
      <div className="kpis">{stats.map(([l, v]) => <div className="card kpi" key={l}><small>{l}</small><b>{v}</b></div>)}</div>
      <div className="card scroll"><table><thead><tr><th>Tanggal</th><th>Barang</th><th>Lokasi</th><th>Jenis</th><th>Biaya</th></tr></thead><tbody>
        {rows.map((r) => <tr key={r.id}><td>{r.tanggal.toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "UTC" })}</td><td><b>{r.barang.nama}</b><br /><small className="note">{r.barang.kode}</small></td><td>{r.barang.lokasi}</td><td><span className="badge info">{r.jenis}</span></td><td>{rp(r.biaya)}</td></tr>)}</tbody></table></div>
    </>
  );
}