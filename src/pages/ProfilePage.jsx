import React, { useMemo, useState } from 'react';
import BorderGlow from '../BorderGlow';
import { ORG, ACTIVE_PROJECTS, ARCHIVE, STAGES, fmtSum, fmtDate } from '../utils/mockData';

const STATUS_LABEL = {
  'in-progress': { t:"Jarayonda",      cls:'badge-info' },
  'review':      { t:"Qabul jarayoni", cls:'badge-wa'   },
  'planning':    { t:"Rejalashtirish", cls:'badge-info' },
  'done':        { t:"Bajarilgan",     cls:'badge-ok'   },
};

/* ── 6 KPI: zamonaviy bitta qatorli grid ────────────────────── */
const KPI_DEFS = (s) => ([
  { k:'contracts', l:"Jami shartnomalar",   v: s.totalContracts.toLocaleString('uz-UZ'), x:"hayot davomida",  ico:'📊', c1:'#2563eb', c2:'#3b82f6', trend:{ d:'up',   v:'+8%'  } },
  { k:'sum',       l:"Umumiy summa",         v: fmtSum(s.totalSum),                       x:"barcha vaqt",       ico:'💰', c1:'#06b6d4', c2:'#22d3ee', trend:{ d:'up',   v:'+12%' } },
  { k:'avg',       l:"O'rtacha ijro",        v: s.avgDuration + ' kun',                  x:"shartnoma bo'yicha",ico:'⏱️',  c1:'#8b5cf6', c2:'#a78bfa', trend:{ d:'down', v:'-4%'  } },
  { k:'active',    l:"Joriy loyihalar",      v: s.activeProjects,                         x:"faol holatda",      ico:'🚀', c1:'#10b981', c2:'#34d399', trend:{ d:'neutral', v:'5 yangi' } },
  { k:'done',      l:"Yil ichida bajarilgan",v: s.completedYear,                          x:"2026",              ico:'✅', c1:'#f59e0b', c2:'#fbbf24', trend:{ d:'up',   v:'+18%' } },
  { k:'savings',   l:"Tejamkorlik",          v: fmtSum(s.savings),                         x:"AI tahlil bilan",   ico:'💎', c1:'#ec4899', c2:'#f472b6', trend:{ d:'up',   v:'+23%' } },
]);

export default function ProfilePage({ dark }) {
  const cardBg = dark ? 'rgba(8,18,42,.85)' : '#ffffff';
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const projects = useMemo(() => {
    let list = ACTIVE_PROJECTS;
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.executor.name.toLowerCase().includes(q) ||
        (p.no || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, statusFilter]);

  return (
    <div className="container" style={{ padding:'40px 28px 20px' }}>

      {/* ── HEADER ── */}
      <div className="a-su" style={{ marginBottom:32 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:100, marginBottom:16,
          background:'rgba(37,99,235,.10)', border:'1px solid rgba(37,99,235,.30)',
          fontFamily:'monospace', fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color: dark?'#60a5fa':'#2563eb',
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}/>
          Buyurtmachi davlat tashkiloti
        </div>
        <h1 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:900, color:'var(--t1)', letterSpacing:'-.03em', lineHeight:1.15 }}>
          {ORG.name}
        </h1>
        <p style={{ fontSize:14, color:'var(--t3)', marginTop:8 }}>
          {ORG.legal} · {ORG.address}
        </p>
      </div>

      {/* ── KPI: 6 ta bitta qatorda, zamonaviy ── */}
      <div className="a-su d1 kpi-row">
        {KPI_DEFS(ORG.stats).map((k, i) => (
          <div key={k.k} className={`kpi2 a-pop d${i+1}`} style={{ '--kpi-c1': k.c1, '--kpi-c2': k.c2 }}>
            <div className="kpi2-top">
              <div className="kpi2-ico">{k.ico}</div>
              <span className={`kpi2-trend ${k.trend.d}`}>
                {k.trend.d === 'up' && '▲'}
                {k.trend.d === 'down' && '▼'}
                {k.trend.v}
              </span>
            </div>
            <div className="kpi2-l">{k.l}</div>
            <div className="kpi2-v" title={k.v}>{k.v}</div>
            <div className="kpi2-x">{k.x}</div>
          </div>
        ))}
      </div>

      {/* ── 2 ustunli mazmun ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:18, alignItems:'flex-start' }}>

        {/* ── Tashkilot ma'lumotlari ── */}
        <BorderGlow backgroundColor={cardBg} glowColor="210 80 65"
          borderRadius={18} glowRadius={48} glowIntensity={1.2} coneSpread={28}
          colors={['#2563eb','#06b6d4','#3b82f6']}>
          <div style={{ padding:'24px 26px' }}>
            <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:16 }}>
              Rekvizitlar
            </h3>
            <Row k="Tashkilot nomi"    v={ORG.name}/>
            <Row k="Huquqiy maqomi"    v={ORG.legal}/>
            <Row k="Manzil"            v={ORG.address}/>
            <Row k="Telefon"           v={ORG.phone}/>
            <Row k="Email"             v={ORG.email}/>
            <Row k="Veb-sayt"          v={ORG.website}/>

            <div style={{ height:1, background:'var(--brd)', margin:'18px 0' }}/>
            <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>
              Mas'ul shaxslar
            </h3>
            <Row k="Rahbar"            v={ORG.director}/>
            <Row k="Xaridlar bo'yicha" v={`${ORG.contact.name} (${ORG.contact.position})`}/>
            <Row k="Bog'lanish"        v={ORG.contact.phone}/>
          </div>
        </BorderGlow>

        {/* ── Joriy loyihalar + Arxiv ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          <BorderGlow backgroundColor={cardBg} glowColor="190 80 70"
            borderRadius={18} glowRadius={50} glowIntensity={1.2} coneSpread={30}
            colors={['#06b6d4','#3b82f6','#22d3ee']}>
            <div style={{ padding:'24px 26px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:12, flexWrap:'wrap' }}>
                <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)' }}>📋 Joriy loyihalar</h3>
                <span className="badge badge-info">{projects.length} / {ACTIVE_PROJECTS.length}</span>
              </div>

              {/* Qidiruv + filter */}
              <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
                <div className="search-box" style={{ minWidth:200 }}>
                  <input className="inp" placeholder="Loyiha, shartnoma № yoki ijrochi..." value={query} onChange={e => setQuery(e.target.value)}/>
                </div>
                <select className="inp" style={{ width:'auto', flex:'0 0 auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">Barcha holatlar</option>
                  <option value="planning">Rejalashtirish</option>
                  <option value="in-progress">Jarayonda</option>
                  <option value="review">Qabul jarayoni</option>
                </select>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {projects.length === 0 && (
                  <div style={{ padding:'30px 16px', textAlign:'center', color:'var(--t3)', fontSize:13, background:'var(--surf2)', borderRadius:12, border:'1px dashed var(--brd)' }}>
                    Hech narsa topilmadi
                  </div>
                )}
                {projects.map(p => {
                  const s = STATUS_LABEL[p.status] || STATUS_LABEL['in-progress'];
                  return (
                    <div key={p.id} className="proj-card"
                      onClick={() => setSelected(p)}
                      role="button" tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') setSelected(p); }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:8 }}>
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                            <span style={{ fontFamily:'monospace', fontSize:10.5, fontWeight:700, color:'var(--acc)', background:'rgba(37,99,235,.08)', padding:'2px 7px', borderRadius:5, letterSpacing:'.04em' }}>{p.no}</span>
                            {p.delayed && <span className="badge badge-er" style={{ fontSize:9 }}>Kechikmoqda</span>}
                          </div>
                          <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)', marginBottom:4 }}>{p.name}</div>
                          <div style={{ fontSize:12, color:'var(--t3)' }}>
                            {fmtDate(p.start)} → {fmtDate(p.deadline)} · <b style={{ color:'var(--t2)' }}>{p.executor.name}</b> · {fmtSum(p.sum)}
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                          <span className={`badge ${s.cls}`}>{s.t}</span>
                          <span className="proj-arrow" style={{ fontSize:18, fontWeight:700 }}>→</span>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="prg" style={{ flex:1 }}>
                          <div className="prg-bar" style={{ width: `${p.progress}%`, background: p.delayed ? 'linear-gradient(90deg,#dc2626,#fb7185)' : undefined }}/>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'var(--t2)', minWidth:38, textAlign:'right' }}>{p.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BorderGlow>

          <BorderGlow backgroundColor={cardBg} glowColor="270 75 70"
            borderRadius={18} glowRadius={48} glowIntensity={1.1} coneSpread={28}
            colors={['#8b5cf6','#06b6d4','#3b82f6']}>
            <div style={{ padding:'24px 26px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)' }}>📚 Shartnomalar arxivi</h3>
                <button className="btn btn-g" style={{ fontSize:12, padding:'6px 14px' }}>Barchasi →</button>
              </div>

              <div style={{ overflowX:'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>№</th><th>Sana</th><th>Mavzu</th><th>Ijrochi</th><th style={{ textAlign:'right' }}>Summa</th><th>Reyting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ARCHIVE.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontFamily:'monospace', fontWeight:700, color:'var(--t1)' }}>{a.no}</td>
                        <td>{fmtDate(a.date)}</td>
                        <td style={{ color:'var(--t1)', fontWeight:500 }}>{a.subject}</td>
                        <td>{a.executor}</td>
                        <td style={{ textAlign:'right', fontWeight:700, color:'var(--t1)' }}>{fmtSum(a.sum)}</td>
                        <td>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                            <span style={{ color:'#fbbf24' }}>★</span>
                            <b style={{ color:'var(--t1)' }}>{a.rating.toFixed(1)}</b>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </BorderGlow>

        </div>
      </div>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)}/>}
    </div>
  );
}

/* ─── Loyiha ichki ko'rinishi (modal) ───────────────────────── */
function ProjectDetailModal({ project: p, onClose }) {
  const s = STATUS_LABEL[p.status] || STATUS_LABEL['in-progress'];
  const daysLeft = Math.round((new Date(p.deadline) - new Date()) / 86400000);
  const totalDays = Math.round((new Date(p.deadline) - new Date(p.start)) / 86400000);

  return (
    <div className="pd-modal" onClick={onClose}>
      <div className="pd-box" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="pd-head">
          <button className="pd-close" onClick={onClose} aria-label="Yopish">✕</button>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexWrap:'wrap' }}>
            <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'var(--acc)', background:'rgba(37,99,235,.10)', padding:'4px 10px', borderRadius:6, letterSpacing:'.06em' }}>{p.no}</span>
            <span className={`badge ${s.cls}`}>{s.t}</span>
            {p.delayed && <span className="badge badge-er">Kechikmoqda</span>}
            <span className="badge badge-info">Bosqich {p.stage}/6</span>
          </div>
          <h2 style={{ fontSize:'clamp(20px,2.4vw,26px)', fontWeight:900, color:'var(--t1)', letterSpacing:'-.02em', lineHeight:1.2, paddingRight:50 }}>
            {p.name}
          </h2>
          <p style={{ fontSize:13.5, color:'var(--t3)', marginTop:8, lineHeight:1.5 }}>
            {p.description}
          </p>
        </div>

        {/* BODY */}
        <div className="pd-body">

          {/* 4 STAT */}
          <div className="pd-stats">
            <div className="pd-stat">
              <div className="pd-stat-l">Shartnoma summasi</div>
              <div className="pd-stat-v">{fmtSum(p.sum)}</div>
              <div style={{ fontSize:11, color:'var(--ok)', marginTop:4, fontWeight:600 }}>
                Tejamkorlik: {fmtSum(p.startPrice - p.sum)}
              </div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-l">Bajarilgan</div>
              <div className="pd-stat-v">{p.progress}%</div>
              <div className="prg" style={{ marginTop:6 }}>
                <div className="prg-bar" style={{ width: `${p.progress}%`, background: p.delayed ? 'linear-gradient(90deg,#dc2626,#fb7185)' : undefined }}/>
              </div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-l">Muddat</div>
              <div className="pd-stat-v">{fmtDate(p.deadline)}</div>
              <div style={{ fontSize:11, color: daysLeft < 0 ? 'var(--er)' : daysLeft < 30 ? 'var(--wa)' : 'var(--t3)', marginTop:4, fontWeight:600 }}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)} kun kechikkan` : `${daysLeft} kun qoldi`} · jami {totalDays} kun
              </div>
            </div>
            <div className="pd-stat">
              <div className="pd-stat-l">Sarflangan</div>
              <div className="pd-stat-v">{fmtSum(p.budget.spent)}</div>
              <div style={{ fontSize:11, color:'var(--t3)', marginTop:4, fontWeight:600 }}>
                Qoldiq: {fmtSum(p.budget.remaining)}
              </div>
            </div>
          </div>

          {/* XARID BOSQICHLARI (1-6) */}
          <div className="pd-section">
            <div className="pd-section-h">
              <div className="pd-section-t">🛤️ Xarid bosqichlari</div>
            </div>
            <div className="stage-track">
              {STAGES.map((st, idx) => {
                const isDone = p.stage > st.id;
                const isActive = p.stage === st.id;
                return (
                  <React.Fragment key={st.id}>
                    <div className={`stage ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="stage-num">BOSQICH {st.id}</div>
                      <div className="stage-t">{st.t}</div>
                      <div className="stage-d">{st.d}</div>
                    </div>
                    {idx < STAGES.length - 1 && <div className="stage-arrow">›</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* MILESTONES + DOCS + CONTACT */}
          <div className="pd-grid">

            {/* MILESTONES */}
            <div>
              <div className="pd-section-h">
                <div className="pd-section-t">📅 Vaqt o'qi</div>
                <span style={{ fontSize:11, color:'var(--t3)' }}>
                  {p.milestones.filter(m => m.done).length} / {p.milestones.length} bajarilgan
                </span>
              </div>
              <div className="ml">
                {p.milestones.map((m, i) => (
                  <div key={i} className={`ml-i ${m.done ? 'done' : ''} ${m.current ? 'cur' : ''} ${m.delayed ? 'late' : ''}`}>
                    <div style={{ flex:1 }}>
                      <div className="ml-d">{fmtDate(m.date)}</div>
                      <div className="ml-t">{m.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: DOCS + CONTACT + EXECUTOR */}
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

              <div>
                <div className="pd-section-h">
                  <div className="pd-section-t">📎 Hujjatlar</div>
                  <button className="btn btn-g" style={{ fontSize:11, padding:'5px 11px' }} onClick={() => alert('Yangi hujjat yuklash')}>+ Yuklash</button>
                </div>
                <div>
                  {p.docs.map((d, i) => {
                    const ext = d.name.split('.').pop().toUpperCase();
                    return (
                      <div key={i} className="doc-i" onClick={() => alert(`Yuklab olinmoqda: ${d.name}`)}>
                        <div className="doc-ico">{ext.slice(0,3)}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="doc-name">{d.name}</div>
                          <div className="doc-kb">{d.kb} KB</div>
                        </div>
                        <div className="doc-dl">↓</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* IJROCHI */}
              <div>
                <div className="pd-section-h">
                  <div className="pd-section-t">🏢 Ijrochi tashkilot</div>
                </div>
                <div className="cc">
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, paddingBottom:10, borderBottom:'1px dashed var(--brd)' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>
                      {p.executor.name[0]}
                    </div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:'var(--t1)' }}>{p.executor.name}</div>
                      <div style={{ fontSize:11.5, color:'var(--t3)' }}>★ {p.executor.rating} · ijro: {p.executor.completionRate}%</div>
                    </div>
                  </div>
                  <div className="cc-row"><span className="cc-k">Direktor</span><span className="cc-v">{p.executor.director}</span></div>
                  <div className="cc-row"><span className="cc-k">Telefon</span><span className="cc-v" style={{ fontFamily:'monospace' }}>{p.executor.phone}</span></div>
                </div>
              </div>

              {/* LOYIHA MENEJERI */}
              <div>
                <div className="pd-section-h">
                  <div className="pd-section-t">👤 Loyiha menejeri</div>
                </div>
                <div className="cc">
                  <div className="cc-row"><span className="cc-k">F.I.SH</span><span className="cc-v">{p.contact.name}</span></div>
                  <div className="cc-row"><span className="cc-k">Lavozim</span><span className="cc-v">{p.contact.role}</span></div>
                  <div className="cc-row"><span className="cc-k">Telefon</span><span className="cc-v" style={{ fontFamily:'monospace' }}>{p.contact.phone}</span></div>
                  <div className="cc-row"><span className="cc-k">Email</span><span className="cc-v" style={{ fontSize:12 }}>{p.contact.email}</span></div>
                </div>
              </div>

            </div>
          </div>

          {/* HARAKAT TUGMALARI */}
          <div style={{ display:'flex', gap:10, marginTop:24, paddingTop:18, borderTop:'1px solid var(--brd)', flexWrap:'wrap' }}>
            <button className="btn btn-p" onClick={() => alert(`PDF eksport: ${p.no}`)}>
              <span>📥 Hisobotni yuklab olish</span>
            </button>
            <button className="btn btn-g" onClick={() => alert('Bog\'lanish')}>
              <span>💬 Ijrochi bilan bog'lanish</span>
            </button>
            <button className="btn btn-g" onClick={() => alert('Shartnoma sahifasi')}>
              <span>📄 To'liq shartnoma</span>
            </button>
            <button className="btn btn-g" style={{ marginLeft:'auto', color:'var(--er)', borderColor:'var(--er-b)' }} onClick={() => alert('Tafsilotlar yopildi')}>
              <span>⚠ Muammo bildirish</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display:'flex', gap:12, padding:'7px 0', fontSize:13.5 }}>
      <div style={{ flex:'0 0 130px', color:'var(--t3)', fontWeight:600 }}>{k}</div>
      <div style={{ flex:1, color:'var(--t1)', fontWeight:500 }}>{v}</div>
    </div>
  );
}
