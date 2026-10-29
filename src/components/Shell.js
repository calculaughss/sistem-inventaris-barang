"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Ic = ({ d }) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const SUN = "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4";
const MOON = "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z";
const MENU = [
  ["/", "Dashboard", "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"],
  ["/barang", "Data Barang", "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8"],
  ["/perawatan", "Perawatan", "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.1-.6-.6-2.1z"],
];

export default function Shell({ children }) {
  const path = usePathname();
  const [mini, setMini] = useState(false), [open, setOpen] = useState(false), [dark, setDark] = useState(false);
  useEffect(() => { setMini(localStorage.getItem("mini") === "1"); setDark(document.documentElement.dataset.theme === "dark"); }, []);
  useEffect(() => setOpen(false), [path]);
  const toggleMini = () => setMini((m) => { localStorage.setItem("mini", m ? "0" : "1"); return !m; });
  const toggleTheme = () => { const d = !dark; setDark(d); document.documentElement.dataset.theme = d ? "dark" : "light"; localStorage.setItem("theme", d ? "dark" : "light"); };
  const active = (h) => (h === "/" ? path === "/" : path.startsWith(h));
  const title = (MENU.find((m) => active(m[0])) || MENU[0])[1];

  return (
    <div className={"app" + (mini ? " mini" : "") + (open ? " open" : "")}>
      <aside className="side">
        <div className="logo-row"><span className="logo">❖</span><div className="lt"><b>SMK Mitra Batik</b><small>Inventaris Sekolah</small></div></div>
        <p className="cap">Menu</p>
        <nav>{MENU.map(([h, l, d]) => <Link key={h} href={h} title={l} className={active(h) ? "on" : ""}><Ic d={d} /><span>{l}</span></Link>)}</nav>
        <div className="side-foot">
          <button onClick={toggleTheme} title="Ganti tema"><Ic d={dark ? SUN : MOON} /><span>{dark ? "Mode Terang" : "Mode Gelap"}</span></button>
          <button className="hide-m" onClick={toggleMini} title="Ciutkan"><Ic d={mini ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} /><span>Ciutkan menu</span></button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button className="burger" onClick={() => setOpen(true)} aria-label="Menu"><Ic d="M4 6h16M4 12h16M4 18h16" /></button>
          <h2>{title}</h2><span className="sp" />
          <span className="pill">Tasikmalaya · T.A. 2026/2027</span><span className="avatar">AD</span>
        </header>
        <main className="content">{children}</main>
        <footer className="foot">© {new Date().getFullYear()} SMK Mitra Batik Tasikmalaya · Data demo</footer>
      </div>
    </div>
  );
}