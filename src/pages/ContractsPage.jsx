import React, { useMemo, useState } from 'react';
import BorderGlow from '../BorderGlow';
import { CONTRACTS, STAGES, fmtSum, fmtDate } from '../utils/mockData';

export default function ContractsPage({ dark }) {
  const cardBg = dark ? 'rgba(8,18,42,.85)' : '#ffffff';
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all')      return CONTRACTS;
    if (filter === 'delayed')  return CONTRACTS.filter(c => c.delayed);
    if (filter === 'active')   return CONTRACTS.filter(c => c.stage >= 4 && c.stage <= 5);
    if (filter === 'announced')return CONTRACTS.filter(c => c.stage <= 2);
    if (filter === 'done')     return CONTRACTS.filter(c => c.stage === 6);
    return CONTRACTS;
  }, [filter]);

  const counts = {
    all:       CONTRACTS.length,
    announced: CONTRACTS.filter(c => c.stage <= 2).length,
    active:    CONTRACTS.filter(c => c.stage >= 4 && c.stage <= 5).length,
    delayed:   CONTRACTS.filter(c => c.delayed).length,
    done:      CONTRACTS.filter(c => c.stage === 6).length,
  };

  return (
    <div className="container" style={{ padding:'40px 28px 20px' }}>

      <div className="a-su" style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'clamp(24px,2.6vw,34px)', fontWeight:900, color:'var(--t1)', letterSpacing:'-.03em' }}>
          📄 Tuzilgan Shartnomalar
        </h1>
        <p style={{ fontSize:14, color:'var(--t3)', marginTop:6 }}>
          Har bir xaridning real vaqt rejimida 6 bosqichli kuzatuvi
        </p>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="a-su d1" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:22 }}>
        {[
          { id:'all',       l:'Barchasi',           c:counts.all      },
          { id:'announced', l:"E'lon qilingan",     c:counts.announced},
          { id:'active',    l:'Faol jarayonda',     c:counts.active   },
          { id:'delayed',   l:'⚠ Kechikkan',        c:counts.delayed  },
          { id:'done',      l:'Yakunlangan',        c:counts.done     },
        ].map(f => {
          const on = f.id === filter;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding:'9px 16px', borderRadius:11,
              background: on ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'var(--surf2)',
              color: on ? '#fff' : 'var(--t2)',
              border: `1.5px solid ${on ? 'transparent' : 'var(--brd)'}`,
              fontSize:13, fontWeight:600, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:8,
              boxShadow: on ? '0 4px 18px rgba(37,99,235,.35)' : 'none',
            }}>
              {f.l}
              <span style={{
                padding:'1px 7px', borderRadius:8, fontSize:11, fontWeight:800,
                background: on ? 'rgba(255,255,255,.22)' : 'var(--surf3)',
                color: on ? '#fff' : 'var(--t3)',
              }}>{f.c}</span>
            </button>
          );
        })}
      </div>

      {/* ── CONTRACT CARDS ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {filtered.map((c, i) => (
          <BorderGlow key={c.id} backgroundColor={cardBg}
            glowColor={c.delayed ? '0 80 65' : '210 80 65'}
            borderRadius={16} glowRadius={42} glowIntensity={1.1} coneSpread={26}
            colors={[c.delayed ? '#ef4444' : '#2563eb', '#06b6d4', '#8b5cf6']}>
            <div className={`a-pop d${i}`} style={{ padding:'22px 24px' }}>

              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:14, alignItems:'flex-start', marginBottom:18 }}>
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'monospace', fontSize:12.5, fontWeight:800, color:'var(--acc)', padding:'3px 9px', borderRadius:6, background:'rgba(37,99,235,.10)', border:'1px solid rgba(37,99,235,.25)' }}>
                      {c.no}
                    </span>
                    {c.delayed && <span className="badge badge-er">⚠ Kechikmoqda</span>}
                    {c.stage === 6 && <span className="badge badge-ok">✓ Yakunlandi</span>}
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:800, color:'var(--t1)', fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'-.02em' }}>
                    {c.subject}
                  </h3>
                  <div style={{ fontSize:13, color:'var(--t3)', marginTop:4 }}>
                    {c.customer} → <b style={{ color:'var(--t2)' }}>{c.executor}</b>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--t3)', letterSpacing:'.05em', textTransform:'uppercase' }}>Shartnoma summasi</div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:900, color:'var(--t1)', letterSpacing:'-.02em' }}>{fmtSum(c.sum)}</div>
                  <div style={{ fontSize:11, color:'var(--t3)', marginTop:2 }}>
                    Boshlang'ich: {fmtSum(c.startPrice)} · Tejam: <b style={{ color:'var(--ok)' }}>−{(((c.startPrice-c.sum)/c.startPrice)*100).toFixed(1)}%</b>
                  </div>
                </div>
              </div>

              {/* Stage track */}
              <div className="stage-track">
                {STAGES.map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <div className={`stage ${c.stage > s.id ? 'done' : c.stage === s.id ? 'active' : ''}`}>
                      <div className="stage-num">BOSQICH {s.id}</div>
                      <div className="stage-t">{s.t}</div>
                      <div className="stage-d">{s.d}</div>
                    </div>
                    {idx < STAGES.length - 1 && <div className="stage-arrow">›</div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Footer info */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:14, marginTop:18, padding:'14px 0 0', borderTop:'1px dashed var(--brd)' }}>
                <Mini l="Imzolangan"   v={fmtDate(c.signedAt)}/>
                <Mini l="Muddat"        v={fmtDate(c.deadline)}/>
                <Mini l="Ishtirokchilar" v={`${c.participants} ta`}/>
                <Mini l="Hujjatlar"     v={`${c.docs.length} ta fayl`}/>
                <Mini l="Bajarilish"    v={`${c.progress}%`}/>
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginTop:14, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:240 }}>
                  <div className="prg" style={{ height:10 }}>
                    <div className="prg-bar" style={{
                      width:`${c.progress}%`,
                      background: c.delayed ? 'linear-gradient(90deg,#ef4444,#f59e0b)' : 'linear-gradient(90deg,#2563eb,#06b6d4)',
                    }}/>
                  </div>
                </div>
                <button onClick={() => setOpen(c)} className="btn btn-g" style={{ fontSize:13 }}>
                  <span>Batafsil →</span>
                </button>
              </div>

              <div style={{ fontSize:12, color:'var(--t3)', marginTop:10, fontStyle:'italic' }}>
                ➤ Keyingi qadam: <b style={{ color: c.delayed ? 'var(--er)' : 'var(--t2)' }}>{c.nextStep}</b>
              </div>
            </div>
          </BorderGlow>
        ))}
      </div>

      {open && <ContractModal c={open} onClose={() => setOpen(null)}/>}
    </div>
  );
}

function Mini({ l, v }) {
  return (
    <div>
      <div style={{ fontSize:10, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>{l}</div>
      <div style={{ fontSize:13.5, fontWeight:700, color:'var(--t1)', marginTop:2 }}>{v}</div>
    </div>
  );
}

function ContractModal({ c, onClose }) {
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:780 }}>
        <div className="modal-head">
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:'monospace', fontSize:12, fontWeight:800, color:'var(--acc)' }}>{c.no}</div>
            <h2 style={{ fontSize:18, fontWeight:900, color:'var(--t1)', marginTop:2 }}>{c.subject}</h2>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:9, background:'var(--surf2)', border:'1px solid var(--brd)', cursor:'pointer', fontSize:16, color:'var(--t2)' }}>✕</button>
        </div>
        <div className="modal-body">

          {/* Details */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
            <Det k="Buyurtmachi"        v={c.customer}/>
            <Det k="Ijrochi"            v={c.executor}/>
            <Det k="Imzolangan"          v={fmtDate(c.signedAt)}/>
            <Det k="Muddat"              v={fmtDate(c.deadline)}/>
            <Det k="Boshlang'ich narx" v={fmtSum(c.startPrice)}/>
            <Det k="Shartnoma summasi"  v={fmtSum(c.sum)}/>
          </div>

          {/* Winner reason */}
          {c.winner && (
            <div style={{ padding:'14px 16px', borderRadius:12, background:'var(--ok-bg)', border:'1px solid var(--ok-b)', marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--ok)', textTransform:'uppercase', letterSpacing:'.06em' }}>🏆 G'olib aniqlangan</div>
              <div style={{ fontSize:13.5, color:'var(--t1)', marginTop:6 }}>
                <b>{c.executor}</b> · Bahosi: <b>{c.winner.score}/100</b><br/>
                <span style={{ color:'var(--t3)' }}>Asoslash: {c.winner.reason}</span>
              </div>
            </div>
          )}

          {/* Documents */}
          <h3 style={{ fontSize:13, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:12 }}>📂 Hujjatlar</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {c.docs.map((d, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
                padding:'12px 14px', borderRadius:10, background:'var(--surf2)', border:'1px solid var(--brd)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:'rgba(37,99,235,.10)', border:'1px solid rgba(37,99,235,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>📄</div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'var(--t1)' }}>{d.name}</div>
                    <div style={{ fontSize:11, color:'var(--t3)' }}>{d.kb} KB · PDF</div>
                  </div>
                </div>
                <button className="btn btn-g" style={{ fontSize:12, padding:'6px 14px' }}><span>↓ Yuklash</span></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Det({ k, v }) {
  return (
    <div style={{ padding:'10px 12px', borderRadius:10, background:'var(--surf2)', border:'1px solid var(--brd)' }}>
      <div style={{ fontSize:10, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>{k}</div>
      <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)', marginTop:3 }}>{v}</div>
    </div>
  );
}
