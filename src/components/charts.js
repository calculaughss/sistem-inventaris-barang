// Grafik SVG murni (tanpa library) — server component
export function Donut({ data, center }) {
  const tot = data.reduce((a, d) => a + d.value, 0) || 1, r = 60, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 160 160" className="donut">
      <circle cx="80" cy="80" r={r} fill="none" stroke="var(--track)" strokeWidth="22" />
      {data.map((d) => {
        const len = (d.value / tot) * c;
        const el = <circle key={d.label} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="22" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} transform="rotate(-90 80 80)"><title>{`${d.label}: ${d.value}`}</title></circle>;
        off += len; return el;
      })}
      <text x="80" y="82" textAnchor="middle" className="dn">{center[0]}</text>
      <text x="80" y="98" textAnchor="middle" className="ds">{center[1]}</text>
    </svg>
  );
}
export function Legend({ data, fmt = (v) => v }) {
  const t = data.reduce((a, d) => a + d.value, 0) || 1;
  return <ul className="legend">{data.map((d) => <li key={d.label}><i style={{ background: d.color }} /><span>{d.label}</span><b>{fmt(d.value)}</b><em>{Math.round((d.value / t) * 100)}%</em></li>)}</ul>;
}
export function AreaChart({ data, fmt }) {
  const W = 600, H = 230, pl = 14, pr = 14, pt = 28, pb = 30, max = Math.max(...data.map((d) => d.value)) || 1;
  const x = (i) => pl + (i * (W - pl - pr)) / Math.max(1, data.length - 1), y = (v) => pt + (H - pt - pb) * (1 - v / max);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".5" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1={pl} x2={W - pr} y1={y(max * t)} y2={y(max * t)} stroke="var(--track)" />)}
      <path d={`${line} L${x(data.length - 1)},${H - pb} L${x(0)},${H - pb} Z`} fill="url(#ag)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="4.5" fill="var(--card)" stroke="var(--primary)" strokeWidth="2"><title>{`${d.label}: ${fmt(d.value)}`}</title></circle>
          <text x={x(i)} y={y(d.value) - 10} textAnchor="middle" className="vl">{fmt(d.value)}</text>
          <text x={x(i)} y={H - 8} textAnchor="middle" className="al">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}
export function Bars({ data, fmt }) {
  const W = 600, H = 210, pb = 28, pt = 22, gap = 10, n = data.length, bw = (W - gap * (n + 1)) / n, max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart">
      {data.map((d, i) => {
        const h = ((H - pt - pb) * d.value) / max, x = gap + i * (bw + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - pb - h} width={bw} height={h} rx="5" fill={d.value === max ? "var(--accent)" : "var(--primary)"}><title>{`${d.label}: ${fmt(d.value)}`}</title></rect>
            <text x={x + bw / 2} y={H - pb - h - 6} textAnchor="middle" className="vl">{d.value ? fmt(d.value) : ""}</text>
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="al">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}