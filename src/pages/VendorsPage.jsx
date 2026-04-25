import React, { useMemo, useState } from 'react';
import BorderGlow from '../BorderGlow';
import { VENDORS, SECTORS, fmtSum, fmtDate } from '../utils/mockData';

const REQUEST_KEY = 'tendertrack_requests';
function loadRequests() {
  try { return JSON.parse(localStorage.getItem(REQUEST_KEY) || '[]'); } catch { return []; }
}
function saveRequest(req) {
  const all = loadRequests();
  all.unshift(req);
  localStorage.setItem(REQUEST_KEY, JSON.stringify(all));
}

function Stars({ n, size=14 }) {
  return (
    <span style={{ display:'inline-flex', gap:1, fontSize:size, color:'#fbbf24' }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= Math.round(n) ? 1 : .25 }}>★</span>)}
    </span>
  );
}

export default function VendorsPage({ dark }) {
  const cardBg = dark ? 'rgba(8,18,42,.85)' : '#ffffff';
  const [sector, setSector] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('rating');
  const [open, setOpen] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(loadRequests());

  const filtered = useMemo(() => {
    let arr = VENDORS;
    if (sector !== 'all') arr = arr.filter(v => v.sector === sector);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter(v =>
        v.name.toLowerCase().includes(s) ||
        v.region.toLowerCase().includes(s) ||
        v.stir.includes(s)
      );
    }
    arr = [...arr].sort((a,b) => {
      if (sort === 'rating')    return b.rating - a.rating;
      if (sort === 'contracts') return b.contractsDone - a.contractsDone;
      if (sort === 'name')      return a.name.localeCompare(b.name);
      return 0;
    });
    return arr;
  }, [sector, q, sort]);

  const sectorCounts = useMemo(() => {
    const c = {};
    VENDORS.forEach(v => { c[v.sector] = (c[v.sector]||0) + 1; });
    return c;
  }, []);

  return (
    <div className="container" style={{ padding:'40px 28px 20px' }}>

      <div className="a-su" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:'clamp(24px,2.6vw,34px)', fontWeight:900, color:'var(--t1)', letterSpacing:'-.03em' }}>
            🏢 Sotuvchi Tashkilotlar Reestri
          </h1>
          <p style={{ fontSize:14, color:'var(--t3)', marginTop:6 }}>
            Davlat xaridlarida ishtirok etuvchi {VENDORS.length} ta tasdiqlangan tashkilot
          </p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button onClick={() => setShowHistory(true)} className="btn btn-g">
            <span>📋 Mening so'rovlarim {history.length > 0 && <span style={{ marginLeft:6, padding:'1px 8px', borderRadius:10, background:'var(--acc)', color:'#fff', fontSize:11, fontWeight:800 }}>{history.length}</span>}</span>
          </button>
          <button onClick={() => setShowRegister(true)} className="btn btn-g">
            <span>+ Ro'yxatdan o'tish</span>
          </button>
        </div>
      </div>

      {/* ── SECTOR PILLS ── */}
      <div className="a-su d1" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18, overflow:'auto', paddingBottom:4 }}>
        {SECTORS.map(s => {
          const n = s.id === 'all' ? VENDORS.length : (sectorCounts[s.id] || 0);
          const active = s.id === sector;
          return (
            <button key={s.id} onClick={() => setSector(s.id)} style={{
              padding:'9px 16px', borderRadius:11,
              background: active ? 'linear-gradient(135deg,#2563eb,#06b6d4)' : 'var(--surf2)',
              color: active ? '#fff' : 'var(--t2)',
              border: `1.5px solid ${active ? 'transparent' : 'var(--brd)'}`,
              fontSize:13, fontWeight:600, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:8,
              whiteSpace:'nowrap', transition:'all .2s',
              boxShadow: active ? '0 4px 18px rgba(37,99,235,.4)' : 'none',
            }}>
              <span>{s.icon}</span>
              {s.name}
              <span style={{
                padding:'1px 7px', borderRadius:8, fontSize:11, fontWeight:800,
                background: active ? 'rgba(255,255,255,.22)' : 'var(--surf3)',
                color: active ? '#fff' : 'var(--t3)',
              }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* ── FILTERS ── */}
      <div className="a-su d2" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12, marginBottom:22 }}>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--t3)' }}>🔍</span>
          <input className="inp" placeholder="Nom, STIR yoki hudud bo'yicha qidirish..."
            style={{ paddingLeft:38 }}
            value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        <select className="inp" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="rating">Reyting bo'yicha (yuqoridan past)</option>
          <option value="contracts">Shartnomalar soni</option>
          <option value="name">Alifbo bo'yicha</option>
        </select>
      </div>

      {/* ── GRID ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16, marginBottom:30 }}>
        {filtered.map((v, i) => {
          const sectorInfo = SECTORS.find(s => s.id === v.sector);
          const glowH = v.rating >= 4.5 ? '160 70 65' : v.rating >= 4 ? '210 80 65' : '40 80 65';
          return (
            <BorderGlow key={v.id} backgroundColor={cardBg} glowColor={glowH}
              borderRadius={16} glowRadius={42} glowIntensity={1.1} coneSpread={26}
              colors={[v.rating >= 4.5 ? '#10b981' : '#2563eb', '#06b6d4', '#8b5cf6']}>
              <div onClick={() => setOpen(v)} className={`a-pop d${(i%6)}`} style={{ padding:'20px 22px', cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div style={{
                    width:46, height:46, borderRadius:12,
                    background:'linear-gradient(135deg, rgba(37,99,235,.15), rgba(6,182,212,.15))',
                    border:'1.5px solid var(--brd)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                  }}>{sectorInfo?.icon || '🏢'}</div>
                  <div style={{
                    padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:800,
                    background: v.rating >= 4.5 ? 'var(--ok-bg)' : v.rating >= 4 ? 'rgba(37,99,235,.10)' : 'var(--wa-bg)',
                    color:    v.rating >= 4.5 ? 'var(--ok)' : v.rating >= 4 ? 'var(--acc)' : 'var(--wa)',
                    border: `1px solid ${v.rating >= 4.5 ? 'var(--ok-b)' : v.rating >= 4 ? 'rgba(37,99,235,.3)' : 'var(--wa-b)'}`,
                  }}>★ {v.rating.toFixed(1)}</div>
                </div>

                <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)', marginBottom:6, fontFamily:"'Space Grotesk',sans-serif" }}>{v.name}</h3>
                <div style={{ fontSize:12, color:'var(--t3)', marginBottom:14 }}>
                  {sectorInfo?.name} · {v.region}
                </div>

                <div style={{ display:'flex', gap:14, fontSize:12, color:'var(--t2)', borderTop:'1px solid var(--brd)', paddingTop:12 }}>
                  <Stat l="Shartnomalar" v={v.contractsDone}/>
                  <Stat l="O'z vaqtida"  v={v.completionRate + '%'}/>
                  <Stat l="Sifat"         v={v.qualityScore.toFixed(1)}/>
                </div>
              </div>
            </BorderGlow>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', padding:60, textAlign:'center', color:'var(--t3)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔎</div>
            Hech qanday tashkilot topilmadi
          </div>
        )}
      </div>

      {open && <VendorModal v={open} onClose={() => setOpen(null)}/>}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)}/>}
      {showHistory && (
        <HistoryModal
          requests={history}
          onClose={() => { setShowHistory(false); setHistory(loadRequests()); }}
          onClear={() => { localStorage.removeItem(REQUEST_KEY); setHistory([]); }}
        />
      )}
    </div>
  );
}

function Stat({ l, v }) {
  return (
    <div style={{ flex:1 }}>
      <div style={{ fontSize:10, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>{l}</div>
      <div style={{ fontSize:14, fontWeight:800, color:'var(--t1)', marginTop:2, fontFamily:"'Space Grotesk',sans-serif" }}>{v}</div>
    </div>
  );
}

function VendorModal({ v, onClose }) {
  const sectorInfo = SECTORS.find(s => s.id === v.sector);
  const [tab, setTab] = useState('info');
  const TABS = [
    { id:'info',    l:'Ma\'lumot' },
    { id:'goods',   l:`Tovar/Xizmatlar (${v.products.length})` },
    { id:'history', l:`Tarix (${v.history.length})` },
    { id:'reviews', l:`Sharhlar (${v.reviews.length})` },
  ];

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:920 }}>
        <div className="modal-head">
          <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:0 }}>
            <div style={{
              width:52, height:52, borderRadius:13,
              background:'linear-gradient(135deg, rgba(37,99,235,.18), rgba(6,182,212,.15))',
              border:'1.5px solid var(--brd-a)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0,
            }}>{sectorInfo?.icon}</div>
            <div style={{ minWidth:0 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:'var(--t1)', letterSpacing:'-.02em' }}>{v.name}</h2>
              <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>STIR: {v.stir} · {sectorInfo?.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:9, background:'var(--surf2)', border:'1px solid var(--brd)',
            cursor:'pointer', fontSize:16, color:'var(--t2)',
          }}>✕</button>
        </div>

        <div style={{ display:'flex', gap:2, padding:'12px 22px', borderBottom:'1px solid var(--brd)', overflow:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`nav-link${tab === t.id ? ' on' : ''}`}>{t.l}</button>
          ))}
        </div>

        <div className="modal-body">
          {tab === 'info' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              <div>
                <H>Rekvizitlar</H>
                <KV k="Tashkilot"        v={v.name}/>
                <KV k="STIR"              v={v.stir}/>
                <KV k="Yuridik manzil"   v={v.address}/>
                <KV k="Hudud"             v={v.region}/>
                <KV k="Rahbar"            v={v.director}/>
                <KV k="Telefon"           v={v.phone}/>
              </div>
              <div>
                <H>AI Reyting va ko'rsatkichlar</H>
                <div style={{ padding:18, borderRadius:14, background:'linear-gradient(135deg, rgba(37,99,235,.08), rgba(6,182,212,.05))', border:'1px solid rgba(37,99,235,.22)', marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--t3)', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' }}>Umumiy ishonchlilik</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:10, marginTop:4 }}>
                    <span style={{ fontSize:36, fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, color:'var(--t1)' }}>{v.rating.toFixed(1)}</span>
                    <Stars n={v.rating} size={18}/>
                    <span style={{ fontSize:11, color:'var(--t3)', marginLeft:'auto' }}>AI · 5 ballik</span>
                  </div>
                </div>
                <Bar l="O'z vaqtida bajarish" v={v.completionRate} max={100} unit="%"/>
                <Bar l="Sifat ko'rsatkichi"   v={v.qualityScore*20} max={100} unit="%"/>
                <Bar l="Muloqot bahosi"       v={v.communicationScore*20} max={100} unit="%"/>
                <KV k="Bajarilgan shartnomalar" v={v.contractsDone}/>
              </div>
            </div>
          )}

          {tab === 'goods' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {v.products.map((p, i) => (
                <div key={i} className="card" style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'var(--t3)', marginTop:4 }}>Narx diapazoni: <b style={{ color:'var(--t2)' }}>{p.price}</b></div>
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <table className="tbl">
              <thead><tr>
                <th>№</th><th>Sana</th><th>Buyurtmachi</th><th style={{ textAlign:'right' }}>Summa</th><th>Holati</th><th>Reyting</th>
              </tr></thead>
              <tbody>
                {v.history.map(h => (
                  <tr key={h.no}>
                    <td style={{ fontFamily:'monospace', fontWeight:700 }}>{h.no}</td>
                    <td>{fmtDate(h.date)}</td>
                    <td>{h.customer}</td>
                    <td style={{ textAlign:'right', fontWeight:700, color:'var(--t1)' }}>{fmtSum(h.sum)}</td>
                    <td><span className={`badge ${h.status === 'Bajarilgan' ? 'badge-ok' : 'badge-info'}`}>{h.status}</span></td>
                    <td>{h.rating ? <span style={{ color:'#fbbf24' }}>★ <b style={{ color:'var(--t1)' }}>{h.rating.toFixed(1)}</b></span> : <span style={{ color:'var(--t3)' }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'reviews' && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {v.reviews.length === 0 && <div style={{ padding:40, textAlign:'center', color:'var(--t3)' }}>Hozircha sharhlar yo'q</div>}
              {v.reviews.map((r, i) => (
                <div key={i} className="card" style={{ padding:'16px 18px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>{r.author}</div>
                    <Stars n={r.stars}/>
                  </div>
                  <div style={{ fontSize:11, color:'var(--t3)', marginBottom:8 }}>{fmtDate(r.date)}</div>
                  <p style={{ fontSize:13.5, color:'var(--t2)', lineHeight:1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function H({ children }) {
  return <h3 style={{ fontSize:11, fontWeight:800, color:'var(--t3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>{children}</h3>;
}
function KV({ k, v }) {
  return (
    <div style={{ display:'flex', gap:12, padding:'7px 0', fontSize:13, borderBottom:'1px dashed var(--brd)' }}>
      <div style={{ flex:'0 0 130px', color:'var(--t3)', fontWeight:600 }}>{k}</div>
      <div style={{ flex:1, color:'var(--t1)', fontWeight:500 }}>{v}</div>
    </div>
  );
}
function Bar({ l, v, max, unit }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
        <span style={{ color:'var(--t3)', fontWeight:600 }}>{l}</span>
        <span style={{ color:'var(--t1)', fontWeight:800 }}>{v.toFixed(0)}{unit}</span>
      </div>
      <div className="prg"><div className="prg-bar" style={{ width:`${(v/max)*100}%` }}/></div>
    </div>
  );
}

function RegisterModal({ onClose }) {
  const [form, setForm] = useState({ name:'', stir:'', address:'', director:'', sector:'build', products:'', license:null });
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
    setTimeout(onClose, 2200);
  };

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:560 }}>
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize:18, fontWeight:900, color:'var(--t1)' }}>Yangi tashkilotni ro'yxatdan o'tkazish</h2>
            <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>Tasdiqlangach reestrga qo'shiladi</div>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:9, background:'var(--surf2)', border:'1px solid var(--brd)', cursor:'pointer', fontSize:16, color:'var(--t2)' }}>✕</button>
        </div>
        <div className="modal-body">
          {done ? (
            <div style={{ padding:'32px 20px', textAlign:'center' }}>
              <div style={{ fontSize:64, marginBottom:14 }}>✅</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:'var(--ok)', marginBottom:8 }}>Ariza qabul qilindi</h3>
              <p style={{ color:'var(--t3)', fontSize:14 }}>Hujjatlar 3-5 ish kuni ichida tekshiriladi va sizga email orqali xabar beriladi.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', gap:6, marginBottom:6 }}>
                {[1,2,3].map(s => (
                  <div key={s} style={{
                    flex:1, height:4, borderRadius:2,
                    background: s <= step ? 'linear-gradient(90deg,#2563eb,#06b6d4)' : 'var(--surf3)',
                  }}/>
                ))}
              </div>

              {step === 1 && <>
                <Field l="Tashkilot nomi *"   ><input className="inp" required value={form.name} onChange={upd('name')}/></Field>
                <Field l="STIR (9 raqam) *"   ><input className="inp" required pattern="\d{9}" value={form.stir} onChange={upd('stir')}/></Field>
                <Field l="Yuridik manzil *"   ><input className="inp" required value={form.address} onChange={upd('address')}/></Field>
              </>}
              {step === 2 && <>
                <Field l="Rahbar (F.I.O) *"    ><input className="inp" required value={form.director} onChange={upd('director')}/></Field>
                <Field l="Faoliyat sohasi *"  >
                  <select className="inp" value={form.sector} onChange={upd('sector')}>
                    {SECTORS.filter(s => s.id !== 'all').map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </Field>
                <Field l="Tovar/xizmatlar ro'yxati *" hint="Vergul bilan ajratib yozing">
                  <textarea className="inp" required rows={4} value={form.products} onChange={upd('products')}
                    style={{ resize:'vertical', minHeight:90 }}/>
                </Field>
              </>}
              {step === 3 && <>
                <Field l="Litsenziya / sertifikat *" hint="PDF, JPG yoki PNG (maks. 10 MB)">
                  <input type="file" className="inp" required accept=".pdf,.jpg,.png" onChange={(e) => setForm(f => ({ ...f, license: e.target.files[0]?.name }))} style={{ padding:9 }}/>
                </Field>
                <div style={{ padding:'12px 14px', borderRadius:10, background:'var(--wa-bg)', border:'1px solid var(--wa-b)', fontSize:12.5, color:'var(--wa)', display:'flex', gap:10 }}>
                  <span style={{ fontSize:18, lineHeight:1 }}>⚠</span>
                  <span>Soxta ma'lumotlar berish javobgarlikka olib keladi. Barcha hujjatlar tekshiruvdan o'tkaziladi.</span>
                </div>
                <div style={{ padding:14, borderRadius:10, background:'var(--surf2)', border:'1px solid var(--brd)' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8 }}>Ko'rib chiqish</div>
                  <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7 }}>
                    <b>{form.name || '—'}</b> · STIR: {form.stir || '—'}<br/>
                    Soha: {SECTORS.find(s=>s.id===form.sector)?.name}<br/>
                    Rahbar: {form.director || '—'}
                  </div>
                </div>
              </>}

              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(s => s-1)} className="btn btn-g" style={{ flex:1 }}>
                    <span>← Orqaga</span>
                  </button>
                )}
                {step < 3 && (
                  <button type="button" onClick={() => setStep(s => s+1)} className="btn btn-p" style={{ flex:1 }}>
                    <span>Keyingisi →</span>
                  </button>
                )}
                {step === 3 && (
                  <button type="submit" className="btn btn-p" style={{ flex:1 }}>
                    <span>Yuborish ✓</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
function Field({ l, hint, children }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <span style={{ fontSize:12, fontWeight:700, color:'var(--t2)' }}>{l}</span>
      {children}
      {hint && <span style={{ fontSize:11, color:'var(--t3)' }}>{hint}</span>}
    </label>
  );
}

/* ─── So'rov yuborish modali (eski, ishlatilmaydi) ─────────── */
function _DeprecatedRequestModal_unused({ vendor, product, onClose }) {
  const sectorInfo = SECTORS.find(s => s.id === vendor.sector);
  const [step, setStep] = useState(1);
  const [savedReq, setSavedReq] = useState(null);
  const [form, setForm] = useState({
    productName: product?.name || '',
    qty: '', unit: 'dona', budgetMin: '', budgetMax: '',
    deadline: '', deliveryAddress: '', specs: '',
    contactName: '', contactPhone: '', contactEmail: '',
    paymentTerms: 'prepaid-30', urgency: 'normal',
  });

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); };
  const reqNo = '';

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:720 }}>

        <div className="modal-head">
          <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0, flex:1 }}>
            <div style={{
              width:44, height:44, borderRadius:11,
              background:'linear-gradient(135deg,#2563eb,#06b6d4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:20, flexShrink:0,
            }}>📨</div>
            <div style={{ minWidth:0 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:'var(--t1)', letterSpacing:'-.02em' }}>
                {step === 1 ? "Tovar/xizmatga so'rov yuborish" : "So'rov yuborildi"}
              </h2>
              <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>
                Sotuvchi: <b style={{ color:'var(--t2)' }}>{vendor.name}</b> · ★ {vendor.rating.toFixed(1)} · {sectorInfo?.name}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:34, height:34, borderRadius:9, background:'var(--surf2)', border:'1px solid var(--brd)',
            cursor:'pointer', fontSize:16, color:'var(--t2)',
          }}>✕</button>
        </div>

        <div className="modal-body">

          {step === 1 && (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Vendor info */}
              <div style={{ padding:'12px 14px', borderRadius:11, background:'var(--surf2)', border:'1px dashed var(--brd-a)', fontSize:12.5, color:'var(--t2)' }}>
                <b style={{ color:'var(--t1)' }}>{vendor.name}</b> · STIR: {vendor.stir} · {vendor.region}<br/>
                Mavjud tovarlar: {vendor.products.map(p => p.name).join(', ')}
              </div>

              <Field l="Kerakli tovar/xizmat *">
                <input className="inp" required placeholder="Masalan: MRT apparati 1.5 Tesla"
                  value={form.productName} onChange={upd('productName')}/>
              </Field>

              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
                <Field l="Miqdori *">
                  <input className="inp" required type="number" min="1" placeholder="Masalan: 5"
                    value={form.qty} onChange={upd('qty')}/>
                </Field>
                <Field l="O'lchov birligi">
                  <select className="inp" value={form.unit} onChange={upd('unit')}>
                    <option value="dona">dona</option>
                    <option value="kg">kg</option>
                    <option value="tonna">tonna</option>
                    <option value="m">metr</option>
                    <option value="m2">m²</option>
                    <option value="komplekt">komplekt</option>
                    <option value="paket">paket</option>
                    <option value="xizmat">xizmat</option>
                  </select>
                </Field>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field l="Byudjet (so'mdan) *" hint="Eng kam summa">
                  <input className="inp" required type="number" placeholder="100 000 000"
                    value={form.budgetMin} onChange={upd('budgetMin')}/>
                </Field>
                <Field l="Byudjet (so'mgacha) *" hint="Eng yuqori summa">
                  <input className="inp" required type="number" placeholder="500 000 000"
                    value={form.budgetMax} onChange={upd('budgetMax')}/>
                </Field>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field l="Yetkazish muddati *">
                  <input className="inp" required type="date" value={form.deadline} onChange={upd('deadline')}/>
                </Field>
                <Field l="Shoshilinch darajasi">
                  <select className="inp" value={form.urgency} onChange={upd('urgency')}>
                    <option value="low">Past — 30+ kun</option>
                    <option value="normal">Oddiy — 14-30 kun</option>
                    <option value="high">Yuqori — 7-14 kun</option>
                    <option value="urgent">Shoshilinch — 7 kundan kam</option>
                  </select>
                </Field>
              </div>

              <Field l="Yetkazish manzili *">
                <input className="inp" required placeholder="Toshkent sh., Mirobod tumani, A. Navoiy 12"
                  value={form.deliveryAddress} onChange={upd('deliveryAddress')}/>
              </Field>

              <Field l="To'lov shartlari">
                <select className="inp" value={form.paymentTerms} onChange={upd('paymentTerms')}>
                  <option value="prepaid-100">100% oldindan to'lov</option>
                  <option value="prepaid-50">50% oldin / 50% yetkazgandan keyin</option>
                  <option value="prepaid-30">30% avans / 70% bajaruvga ko'ra</option>
                  <option value="postpaid">Yetkazgandan keyin to'lov (10 kun)</option>
                </select>
              </Field>

              <Field l="Texnik talablar / qo'shimcha tafsilotlar" hint="Sertifikatlar, sifat standartlari, kafolat muddati va boshqalar">
                <textarea className="inp" rows={4} placeholder="Masalan: ISO 9001 sertifikatlangan, 2 yil kafolat, o'rnatish va trening kiritilgan..."
                  value={form.specs} onChange={upd('specs')}
                  style={{ resize:'vertical', minHeight:90 }}/>
              </Field>

              <div style={{ height:1, background:'var(--brd)', margin:'4px 0' }}/>

              <div style={{ fontSize:11, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.06em' }}>
                Buyurtmachi kontakti
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field l="F.I.SH *">
                  <input className="inp" required placeholder="A. Karimov"
                    value={form.contactName} onChange={upd('contactName')}/>
                </Field>
                <Field l="Telefon *">
                  <input className="inp" required type="tel" placeholder="+998 90 123 45 67"
                    value={form.contactPhone} onChange={upd('contactPhone')}/>
                </Field>
              </div>

              <Field l="Email">
                <input className="inp" type="email" placeholder="email@minzdrav.uz"
                  value={form.contactEmail} onChange={upd('contactEmail')}/>
              </Field>

              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="button" onClick={onClose} className="btn btn-g" style={{ flex:'0 0 auto' }}>
                  <span>Bekor qilish</span>
                </button>
                <button type="submit" className="btn btn-p" style={{ flex:1 }}>
                  <span>So'rovni yuborish →</span>
                </button>
              </div>
            </form>
          )}

          {step === 2 && savedReq && (
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

              {/* Success */}
              <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--ok-bg)', border:'1px solid var(--ok-b)', display:'flex', gap:14, alignItems:'flex-start' }}>
                <div style={{ fontSize:28, lineHeight:1 }}>✅</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--ok)', marginBottom:4 }}>
                    So'rov muvaffaqiyatli yuborildi
                  </div>
                  <div style={{ fontSize:12.5, color:'var(--t2)', lineHeight:1.5 }}>
                    So'rov raqami: <b style={{ fontFamily:'monospace', color:'var(--t1)' }}>{reqNo}</b><br/>
                    Sotuvchiga xabar yuborildi. Odatda javob 24 soat ichida keladi.
                  </div>
                </div>
              </div>

              {/* Request summary */}
              <div style={{ padding:16, borderRadius:12, background:'var(--surf2)', border:'1px solid var(--brd)' }}>
                <div style={{ fontSize:11, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>
                  So'rov tafsilotlari
                </div>
                <SummaryRow k="Tovar/xizmat" v={savedReq.productName}/>
                <SummaryRow k="Miqdori"      v={`${savedReq.qty} ${savedReq.unit}`}/>
                <SummaryRow k="Byudjet"      v={`${Number(savedReq.budgetMin).toLocaleString('uz-UZ')} – ${Number(savedReq.budgetMax).toLocaleString('uz-UZ')} so'm`}/>
                <SummaryRow k="Muddat"       v={fmtDate(savedReq.deadline)}/>
                <SummaryRow k="Manzil"       v={savedReq.deliveryAddress}/>
              </div>

              {/* Contact panel */}
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>
                  💬 Sotuvchi bilan to'g'ridan-to'g'ri bog'lanish
                </div>

                <div style={{ padding:16, borderRadius:14, background:'linear-gradient(135deg,rgba(37,99,235,.06),rgba(6,182,212,.04))', border:'1px solid var(--brd-a)', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#2563eb,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 }}>
                      {vendor.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:14.5, fontWeight:800, color:'var(--t1)' }}>{vendor.name}</div>
                      <div style={{ fontSize:12, color:'var(--t3)' }}>Direktor: {vendor.director}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7 }}>
                    📍 {vendor.address}<br/>
                    📞 <span style={{ fontFamily:'monospace', color:'var(--t1)', fontWeight:600 }}>{vendor.phone}</span>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10 }}>
                  <a href={`tel:${vendor.phone.replace(/\s/g,'')}`} className="btn btn-p" style={{ textDecoration:'none' }}>
                    <span>📞 Qo'ng'iroq qilish</span>
                  </a>
                  <a href={`https://wa.me/${vendor.phone.replace(/[^\d]/g,'')}?text=${encodeURIComponent(`Assalomu alaykum, ${reqNo} raqamli so'rov bo'yicha bog'lanmoqdaman.`)}`}
                     target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ textDecoration:'none', background:'#25D366', color:'#fff', borderColor:'#1da851' }}>
                    <span>💬 WhatsApp</span>
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(`So'rov ${reqNo} — ${savedReq.productName}`)}&body=${encodeURIComponent(`Hurmatli ${vendor.director},\n\nSizga ${reqNo} raqamli so'rov yubordik.\n\nTovar: ${savedReq.productName}\nMiqdori: ${savedReq.qty} ${savedReq.unit}\nMuddat: ${savedReq.deadline}\n\nBatafsil ma'lumot va shartlarni muhokama qilish uchun bog'laning.\n\nHurmat bilan,\n${savedReq.contactName}\n${savedReq.contactPhone}`)}`}
                     className="btn btn-g" style={{ textDecoration:'none' }}>
                    <span>✉️ Email yuborish</span>
                  </a>
                  <button onClick={() => navigator.clipboard?.writeText(vendor.phone)} className="btn btn-g">
                    <span>📋 Raqamni nusxalash</span>
                  </button>
                </div>
              </div>

              <button onClick={onClose} className="btn btn-g" style={{ width:'100%', marginTop:4 }}>
                <span>Yopish</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SummaryRow({ k, v }) {
  return (
    <div style={{ display:'flex', gap:12, padding:'5px 0', fontSize:13 }}>
      <div style={{ flex:'0 0 110px', color:'var(--t3)', fontWeight:600 }}>{k}</div>
      <div style={{ flex:1, color:'var(--t1)', fontWeight:500 }}>{v}</div>
    </div>
  );
}

/* ─── So'rovlar tarixi ─────────────────────────────────────── */
function HistoryModal({ requests, onClose, onClear }) {
  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:780 }}>
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize:18, fontWeight:900, color:'var(--t1)' }}>📋 Mening so'rovlarim</h2>
            <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>
              Jami: {requests.length} ta yuborilgan so'rov
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {requests.length > 0 && (
              <button onClick={() => { if (window.confirm("Barcha so'rovlarni o'chirasizmi?")) onClear(); }}
                className="btn btn-g" style={{ fontSize:12, padding:'7px 12px', color:'var(--er)', borderColor:'var(--er-b)' }}>
                <span>🗑 Tarixni tozalash</span>
              </button>
            )}
            <button onClick={onClose} style={{ width:34, height:34, borderRadius:9, background:'var(--surf2)', border:'1px solid var(--brd)', cursor:'pointer', fontSize:16, color:'var(--t2)' }}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          {requests.length === 0 ? (
            <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--t3)' }}>
              <div style={{ fontSize:54, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--t2)' }}>Hali so'rov yubormagansiz</div>
              <div style={{ fontSize:12, marginTop:6 }}>Sotuvchini tanlab "📨 So'rov yuborish" tugmasini bosing</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {requests.map(r => {
                const v = VENDORS.find(x => x.id === r.vendorId);
                return (
                  <div key={r.id} className="card" style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:6 }}>
                      <div style={{ minWidth:0, flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)' }}>{r.productName}</div>
                        <div style={{ fontSize:12, color:'var(--t3)', marginTop:3 }}>
                          {r.qty} {r.unit} · {Number(r.budgetMin).toLocaleString('uz-UZ')} – {Number(r.budgetMax).toLocaleString('uz-UZ')} so'm · muddat {fmtDate(r.deadline)}
                        </div>
                        <div style={{ fontSize:12, color:'var(--t2)', marginTop:5 }}>
                          → <b>{r.vendorName}</b> {v && <span style={{ color:'var(--t3)' }}>· ★ {v.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                      <span className="badge badge-info" style={{ flexShrink:0 }}>Yuborildi</span>
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:8, paddingTop:8, borderTop:'1px dashed var(--brd)', flexWrap:'wrap' }}>
                      <a href={`tel:${r.vendorPhone?.replace(/\s/g,'')}`} className="btn btn-g" style={{ fontSize:11.5, padding:'6px 12px', textDecoration:'none' }}><span>📞 Qo'ng'iroq</span></a>
                      <a href={`https://wa.me/${r.vendorPhone?.replace(/[^\d]/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ fontSize:11.5, padding:'6px 12px', textDecoration:'none' }}><span>💬 WhatsApp</span></a>
                      <span style={{ marginLeft:'auto', fontSize:11, color:'var(--t3)', alignSelf:'center' }}>{fmtDate(r.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
