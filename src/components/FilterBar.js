"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export default function FilterBar({ kategori }) {
  const r = useRouter(), sp = useSearchParams(), t = useRef();
  const [pending, start] = useTransition();
  const set = (k, v) => {
    const p = new URLSearchParams(sp.toString());
    v ? p.set(k, v) : p.delete(k); p.delete("page");
    start(() => r.replace("/barang?" + p.toString(), { scroll: false }));
  };
  return (
    <div className={"card filter" + (pending ? " busy" : "")}>
      <input defaultValue={sp.get("q") || ""} placeholder="Cari nama, kode, atau lokasi…" onChange={(e) => { clearTimeout(t.current); const v = e.target.value; t.current = setTimeout(() => set("q", v), 300); }} />
      <select defaultValue={sp.get("kategori") || ""} onChange={(e) => set("kategori", e.target.value)}><option value="">Semua kategori</option>{kategori.map((k) => <option key={k}>{k}</option>)}</select>
      <select defaultValue={sp.get("kondisi") || ""} onChange={(e) => set("kondisi", e.target.value)}><option value="">Semua kondisi</option><option>Baik</option><option>Rusak Ringan</option><option>Rusak Berat</option></select>
      <button className="btn ghost" onClick={() => (window.location.href = "/barang")}>Reset</button>
    </div>
  );
}