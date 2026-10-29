import prisma from "@/lib/prisma";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
export const dynamic = "force-dynamic";
const cls = { Baik: "ok", "Rusak Ringan": "warn", "Rusak Berat": "bad" };
const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const PER = 15, SORTS = ["kode", "nama", "kategori", "lokasi", "jumlah", "tahun", "harga", "kondisi"];

export default async function Barang({ searchParams }) {
  const { q = "", kategori = "", kondisi = "", page = "1" } = searchParams;
  const sort = SORTS.includes(searchParams.sort) ? searchParams.sort : "kode", dir = searchParams.dir === "desc" ? "desc" : "asc";
  const where = {
    ...(q && { OR: [{ nama: { contains: q } }, { kode: { contains: q } }, { lokasi: { contains: q } }] }),
    ...(kategori && { kategori }), ...(kondisi && { kondisi }),
  };
  const p = Math.max(1, parseInt(page) || 1);
  const [items, total, kats, agg] = await Promise.all([
    prisma.barang.findMany({ where, orderBy: { [sort]: dir }, skip: (p - 1) * PER, take: PER }),
    prisma.barang.count({ where }),
    prisma.barang.findMany({ distinct: ["kategori"], select: { kategori: true } }),
    prisma.barang.aggregate({ where, _sum: { jumlah: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER));
  const href = (o) => "/barang?" + new URLSearchParams(Object.entries({ q, kategori, kondisi, sort, dir, page: p, ...o }).filter(([, v]) => v !== "").map(([k, v]) => [k, String(v)]));
  const H = (k, l) => <th><Link href={href({ sort: k, dir: sort === k && dir === "asc" ? "desc" : "asc", page: 1 })}>{l}{sort === k ? (dir === "asc" ? " ▲" : " ▼") : ""}</Link></th>;
  return (
    <>
      <div className="pagehead"><div><h1>Data Barang</h1><p>{total} jenis · {(agg._sum.jumlah || 0).toLocaleString("id-ID")} unit sesuai filter</p></div>
        <a className="btn ghost" href="/data/barang.csv" download>Unduh CSV</a></div>
      <FilterBar kategori={kats.map((k) => k.kategori)} />
      <div className="card scroll"><table><thead><tr>{H("kode", "Kode")}{H("nama", "Nama Barang")}{H("kategori", "Kategori")}{H("lokasi", "Lokasi")}{H("jumlah", "Jml")}{H("tahun", "Tahun")}{H("harga", "Harga Satuan")}<th>Sumber Dana</th>{H("kondisi", "Kondisi")}</tr></thead><tbody>
        {items.map((b) => <tr key={b.id}><td>{b.kode}</td><td><b>{b.nama}</b></td><td>{b.kategori}</td><td>{b.lokasi}</td><td>{b.jumlah}</td><td>{b.tahun}</td><td>{rp(b.harga)}</td><td>{b.sumberDana}</td><td><span className={"badge " + cls[b.kondisi]}>{b.kondisi}</span></td></tr>)}
        {!items.length && <tr><td colSpan="9" className="empty">Tidak ada barang yang cocok.</td></tr>}</tbody></table></div>
      <div className="pager">{p > 1 ? <Link href={href({ page: p - 1 })}>← Sebelumnya</Link> : <span />}<span>Halaman {p} / {pages}</span>{p < pages ? <Link href={href({ page: p + 1 })}>Berikutnya →</Link> : <span />}</div>
    </>
  );
}