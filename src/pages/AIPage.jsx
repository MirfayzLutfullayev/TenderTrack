import React, { useState, useMemo, useEffect } from 'react';
import BorderGlow from '../BorderGlow';
import { AI_ALERTS, AI_PRICE_TREND, VENDORS, SECTORS, fmtDate } from '../utils/mockData';

const REQUEST_KEY = 'tendertrack_requests';
function loadRequests() {
  try { return JSON.parse(localStorage.getItem(REQUEST_KEY) || '[]'); } catch { return []; }
}
function saveRequest(req) {
  const all = loadRequests();
  all.unshift(req);
  localStorage.setItem(REQUEST_KEY, JSON.stringify(all));
}
function updateRequest(id, patch) {
  const all = loadRequests();
  const i = all.findIndex(r => r.id === id);
  if (i >= 0) {
    all[i] = { ...all[i], ...patch };
    localStorage.setItem(REQUEST_KEY, JSON.stringify(all));
  }
}

const LEVEL = {
  high:   { l:"Yuqori xavf",   bg:'var(--er-bg)',  c:'var(--er)',  brd:'var(--er-b)',  icon:'🔴' },
  medium: { l:"O'rta xavf",    bg:'var(--wa-bg)',  c:'var(--wa)',  brd:'var(--wa-b)',  icon:'🟠' },
  low:    { l:"Past xavf",     bg:'rgba(37,99,235,.10)', c:'var(--acc)', brd:'rgba(37,99,235,.30)', icon:'🔵' },
};

const TABS = [
  { id:'request', l:"🎯 Smart so'rov", desc:"AI avto-tanlash bilan so'rov yuborish" },
  { id:'monitor', l:"🚨 Monitoring",   desc:"Faol ogohlantirishlar va xavf tahlili" },
  { id:'price',   l:"📊 Narx tahlili", desc:"Bozor narxlari va anomaliyalar" },
];

export default function AIPage({ dark }) {
  const cardBg = dark ? 'rgba(8,18,42,.85)' : '#ffffff';
  const [tab, setTab] = useState('request');

  return (
    <div className="container" style={{ padding:'40px 28px 20px' }}>

      <div className="a-su" style={{ marginBottom:24 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:100, marginBottom:16,
          background:'rgba(139,92,246,.12)', border:'1px solid rgba(139,92,246,.32)',
          fontFamily:'monospace', fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color: dark?'#c4b5fd':'#7c3aed',
        }}>
          <span className="a-spin" style={{ width:7, height:7, borderRadius:'50%', background:'#8b5cf6', boxShadow:'0 0 6px #8b5cf6' }}/>
          Sun'iy intellekt moduli · faol
        </div>
        <h1 style={{ fontSize:'clamp(24px,2.6vw,34px)', fontWeight:900, color:'var(--t1)', letterSpacing:'-.03em' }}>
          🧠 AI Yordamchi
        </h1>
        <p style={{ fontSize:14, color:'var(--t3)', marginTop:6 }}>
          {TABS.find(t => t.id === tab)?.desc}
        </p>
      </div>

      {/* TABS */}
      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding:'12px 20px', borderRadius:12,
                background: active ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'var(--surf2)',
                color: active ? '#fff' : 'var(--t2)',
                border: `1.5px solid ${active ? 'transparent' : 'var(--brd)'}`,
                fontSize:14, fontWeight:700, cursor:'pointer',
                boxShadow: active ? '0 4px 18px rgba(139,92,246,.4)' : 'none',
                transition:'all .2s',
              }}>
              {t.l}
            </button>
          );
        })}
      </div>

      {tab === 'request' && <SmartRequest cardBg={cardBg}/>}
      {tab === 'monitor' && <Monitor cardBg={cardBg}/>}
      {tab === 'price'   && <PriceAnalysis cardBg={cardBg}/>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1. SMART REQUEST — AI auto-match va broadcast
   ───────────────────────────────────────────────────────────── */

const SECTOR_KEYWORDS = {
  build:  ['qurilish','ta\'mir','tamir','bino','poliklinika','sanitariya','elektr','ventilyatsiya','demontaj','pardoz','qavat'],
  med:    ['mrt','dori','vaktsina','tibbiy','apparat','sertifikat','ultrasonografiya','reanimatsiya','antibiotik','tomografiya','farmatsevtik'],
  it:     ['it','kompyuter','dastur','platforma','ilova','yumshoq','bulut','xavfsizlik','arxitektura','sprint','beta','elektron'],
  edu:    ["o'quv",'imtihon','dars','platforma','ta\'lim'],
  food:   ['oziq','ovqat','sut','non','kasalxona','vitamin'],
  office: ['ofis','mebel','kiyim','choyshab','xirurgik','xalat','konferents'],
  trans:  ['transport','yetkazish','avtomobil','yuk'],
};

function matchVendors(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/[\s,.;:]+/).filter(w => w.length > 2);

  const scored = VENDORS.map(v => {
    let score = 0;
    let reasons = [];

    const sectorKws = SECTOR_KEYWORDS[v.sector] || [];
    const matchedSectorKws = sectorKws.filter(kw => lower.includes(kw));
    if (matchedSectorKws.length > 0) {
      score += matchedSectorKws.length * 35;
      reasons.push(`${SECTORS.find(s => s.id === v.sector)?.name} sohasi`);
    }

    const productMatches = v.products.filter(p => {
      const pn = p.name.toLowerCase();
      return words.some(w => pn.includes(w) || w.includes(pn.split(' ')[0]));
    });
    if (productMatches.length > 0) {
      score += productMatches.length * 25;
      reasons.push(`${productMatches.length} ta mos tovar`);
    }

    score += v.rating * 4;
    score += v.completionRate / 8;

    return {
      ...v,
      matchScore: Math.round(score),
      matchReasons: reasons,
      matchedProducts: productMatches,
    };
  });

  return scored
    .filter(v => v.matchScore >= 30)
    .sort((a,b) => b.matchScore - a.matchScore);
}

function SmartRequest({ cardBg }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    description:'', qty:'', unit:'dona',
    budgetMin:'', budgetMax:'', deadline:'',
    address:'', contactName:'', contactPhone:'',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [matched, setMatched] = useState([]);
  const [excluded, setExcluded] = useState(new Set());
  const [savedReq, setSavedReq] = useState(null);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const runAnalysis = (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setStep(2);
    setTimeout(() => {
      const text = `${form.description} ${form.qty} ${form.unit}`;
      setMatched(matchVendors(text));
      setAnalyzing(false);
    }, 1400);
  };

  const sendBroadcast = () => {
    const targetVendors = matched.filter(v => !excluded.has(v.id));
    const reqNo = 'SR-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-5);
    const req = {
      id: 'r-' + Date.now(),
      reqNo,
      createdAt: new Date().toISOString(),
      description: form.description,
      qty: form.qty, unit: form.unit,
      budgetMin: form.budgetMin, budgetMax: form.budgetMax,
      deadline: form.deadline, deliveryAddress: form.address,
      contactName: form.contactName, contactPhone: form.contactPhone,
      productName: form.description,
      broadcast: true,
      vendorIds: targetVendors.map(v => v.id),
      responses: targetVendors.map(v => ({ vendorId: v.id, status:'pending' })),
      status: 'sent',
    };
    saveRequest(req);
    setSavedReq(req);
    setStep(3);

    // Demo: simulyatsiya — sotuvchilar javoblari
    targetVendors.forEach((v, i) => {
      const delay = 1500 + i * 900 + Math.random() * 1500;
      setTimeout(() => {
        const willAccept = v.rating >= 4.3 ? Math.random() > 0.15 : Math.random() > 0.55;
        const newResponse = willAccept
          ? { vendorId: v.id, status:'accepted', message:`Hurmatli xaridor, sizning so'rovingizni qabul qilamiz. ${v.products[0]?.price || 'Narx muhokama qilinadi'}.`, respondedAt: new Date().toISOString() }
          : { vendorId: v.id, status:'declined', message: ['Hozirda zaxiralarimiz to\'liq band','Belgilangan byudjetga sig\'a olmaymiz','Muddat juda qisqa'][Math.floor(Math.random()*3)], respondedAt: new Date().toISOString() };

        setSavedReq(prev => {
          if (!prev) return prev;
          const next = { ...prev, responses: prev.responses.map(r => r.vendorId === v.id ? newResponse : r) };
          updateRequest(prev.id, { responses: next.responses });
          return next;
        });
      }, delay);
    });
  };

  if (step === 1) {
    return (
      <BorderGlow backgroundColor={cardBg} glowColor="270 75 70"
        borderRadius={18} glowRadius={50} glowIntensity={1.2} coneSpread={30}
        colors={['#8b5cf6','#06b6d4','#3b82f6']}>
        <form onSubmit={runAnalysis} style={{ padding:'28px 30px' }}>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:46, height:46, borderRadius:13, background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, boxShadow:'0 6px 22px rgba(139,92,246,.4)' }}>🤖</div>
            <div>
              <h3 style={{ fontSize:18, fontWeight:900, color:'var(--t1)' }}>Sizga nima kerak?</h3>
              <p style={{ fontSize:12.5, color:'var(--t3)', marginTop:3 }}>Tovar/xizmatni tasvirlab bering — AI mos sotuvchilarni o'zi tanlaydi va so'rovni hammasiga jo'natadi</p>
            </div>
          </div>

          <Field l="Tovar/xizmat tavsifi *" hint="Aniq nom, model, hajm va sifat talablarini yozing">
            <textarea className="inp" required rows={4}
              placeholder="Masalan: Toshkent shahar 7-poliklinika uchun MRT apparati 1.5 Tesla, ISO sertifikatlangan, o'rnatish va xodimlarni o'qitish bilan birga..."
              value={form.description} onChange={upd('description')}
              style={{ resize:'vertical', minHeight:100 }}/>
          </Field>

          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12, marginTop:14 }}>
            <Field l="Miqdori *">
              <input className="inp" required type="number" min="1" placeholder="1"
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

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:14 }}>
            <Field l="Byudjet (so'mdan) *">
              <input className="inp" required type="number" placeholder="100 000 000"
                value={form.budgetMin} onChange={upd('budgetMin')}/>
            </Field>
            <Field l="Byudjet (so'mgacha) *">
              <input className="inp" required type="number" placeholder="500 000 000"
                value={form.budgetMax} onChange={upd('budgetMax')}/>
            </Field>
            <Field l="Yetkazish muddati *">
              <input className="inp" required type="date" value={form.deadline} onChange={upd('deadline')}/>
            </Field>
          </div>

          <div style={{ marginTop:14 }}>
            <Field l="Yetkazish manzili *">
              <input className="inp" required placeholder="Toshkent sh., Mirobod tumani, A. Navoiy 12"
                value={form.address} onChange={upd('address')}/>
            </Field>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
            <Field l="Mas'ul shaxs *">
              <input className="inp" required placeholder="A. Karimov"
                value={form.contactName} onChange={upd('contactName')}/>
            </Field>
            <Field l="Telefon *">
              <input className="inp" required type="tel" placeholder="+998 90 123 45 67"
                value={form.contactPhone} onChange={upd('contactPhone')}/>
            </Field>
          </div>

          <div style={{ marginTop:18, padding:'12px 14px', borderRadius:11, background:'rgba(139,92,246,.08)', border:'1px solid rgba(139,92,246,.28)', fontSize:12.5, color:'var(--t2)', display:'flex', gap:10 }}>
            <span style={{ fontSize:18, lineHeight:1 }}>💡</span>
            <span>AI sizning tavsifingizni tahlil qiladi va <b>{VENDORS.length} ta tasdiqlangan tashkilot</b> orasidan eng mos keluvchilarini avtomatik tanlaydi. So'rov bir vaqtda hammasiga jo'natiladi — sizning vaqtingiz tejaladi.</span>
          </div>

          <button type="submit" className="btn btn-p" style={{ width:'100%', marginTop:18 }}>
            <span>🤖 AI tahlilni boshlash →</span>
          </button>
        </form>
      </BorderGlow>
    );
  }

  if (step === 2) {
    return (
      <Step2Match
        cardBg={cardBg}
        analyzing={analyzing}
        matched={matched}
        excluded={excluded}
        setExcluded={setExcluded}
        onBack={() => setStep(1)}
        onSend={sendBroadcast}
        form={form}
      />
    );
  }

  return <Step3Tracking req={savedReq} cardBg={cardBg} onNew={() => { setStep(1); setSavedReq(null); setMatched([]); setExcluded(new Set()); setForm({ description:'', qty:'', unit:'dona', budgetMin:'', budgetMax:'', deadline:'', address:'', contactName:'', contactPhone:'' }); }}/>;
}

/* ── Step 2: AI tomonidan tanlangan sotuvchilar ────────────── */
function Step2Match({ cardBg, analyzing, matched, excluded, setExcluded, onBack, onSend, form }) {
  const toggle = (id) => setExcluded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectedCount = matched.length - excluded.size;

  if (analyzing) {
    return (
      <BorderGlow backgroundColor={cardBg} glowColor="270 75 70"
        borderRadius={18} glowRadius={50} glowIntensity={1.4} coneSpread={32}
        colors={['#8b5cf6','#06b6d4','#3b82f6']}>
        <div style={{ padding:'56px 30px', textAlign:'center' }}>
          <div className="a-spin" style={{ width:60, height:60, borderRadius:'50%', border:'4px solid rgba(139,92,246,.18)', borderTopColor:'#8b5cf6', margin:'0 auto 22px' }}/>
          <h3 style={{ fontSize:18, fontWeight:800, color:'var(--t1)', marginBottom:6 }}>AI tahlil qilmoqda...</h3>
          <p style={{ fontSize:13, color:'var(--t3)' }}>So'rov tavsifi o'qildi · Soha aniqlanmoqda · Reyestrdan mos sotuvchilar tanlanmoqda</p>
        </div>
      </BorderGlow>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:18, padding:'14px 18px', borderRadius:12, background:'linear-gradient(135deg,rgba(139,92,246,.08),rgba(6,182,212,.06))', border:'1px solid rgba(139,92,246,.3)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <span style={{ fontSize:18 }}>✨</span>
          <span style={{ fontSize:14, fontWeight:800, color:'var(--t1)' }}>
            AI {matched.length} ta mos tashkilotni topdi
          </span>
        </div>
        <p style={{ fontSize:12.5, color:'var(--t3)', lineHeight:1.5 }}>
          Tasvir: <i style={{ color:'var(--t2)' }}>"{form.description.slice(0, 100)}{form.description.length > 100 ? '...' : ''}"</i><br/>
          Mos kelmaydiganlarni belgini olib tashlang. Tasdiqlasangiz, so'rov tanlanganlarning hammasiga bir vaqtda jo'natiladi.
        </p>
      </div>

      <BorderGlow backgroundColor={cardBg} glowColor="270 75 70"
        borderRadius={18} glowRadius={48} glowIntensity={1.1} coneSpread={28}
        colors={['#8b5cf6','#06b6d4','#3b82f6']}>
        <div style={{ padding:'24px 26px' }}>

          {matched.length === 0 ? (
            <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--t3)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔎</div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--t2)' }}>Mos sotuvchilar topilmadi</div>
              <div style={{ fontSize:12, marginTop:6 }}>Tovar tavsifini aniqroq yozib qaytadan urunib ko'ring</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {matched.map((v, i) => {
                const off = excluded.has(v.id);
                const sectorInfo = SECTORS.find(s => s.id === v.sector);
                return (
                  <div key={v.id} className={`a-pop d${i%6}`} style={{
                    padding:'14px 16px', borderRadius:12,
                    background: off ? 'var(--surf3)' : 'var(--surf)',
                    border: `1.5px solid ${off ? 'var(--brd)' : 'var(--brd-a)'}`,
                    opacity: off ? .55 : 1,
                    transition:'all .2s',
                    display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:14, alignItems:'center',
                  }}>
                    <input type="checkbox" checked={!off} onChange={() => toggle(v.id)}
                      style={{ width:18, height:18, cursor:'pointer', accentColor:'#8b5cf6' }}/>

                    <div style={{ minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                        <span style={{ fontSize:14, fontWeight:800, color:'var(--t1)' }}>{v.name}</span>
                        <span style={{ fontSize:11, color:'var(--t3)' }}>{sectorInfo?.icon} {sectorInfo?.name} · {v.region}</span>
                      </div>
                      <div style={{ fontSize:11.5, color:'var(--t2)', lineHeight:1.5 }}>
                        ★ {v.rating.toFixed(1)} · {v.contractsDone} shartnoma · o'z vaqtida {v.completionRate}%
                      </div>
                      {v.matchedProducts.length > 0 && (
                        <div style={{ fontSize:11, color:'var(--t3)', marginTop:4 }}>
                          🎯 Mos: <b style={{ color:'var(--acc)' }}>{v.matchedProducts.map(p => p.name).join(', ')}</b>
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:10, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.05em' }}>Moslik</div>
                      <div style={{ fontSize:18, fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, color: v.matchScore >= 80 ? 'var(--ok)' : v.matchScore >= 50 ? 'var(--acc)' : 'var(--wa)' }}>
                        {v.matchScore}
                      </div>
                    </div>

                    <div style={{ width:80, fontSize:10, color:'var(--t3)', lineHeight:1.4 }}>
                      {v.matchReasons.map((r, j) => <div key={j}>· {r}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:18, paddingTop:14, borderTop:'1px solid var(--brd)' }}>
            <button onClick={onBack} className="btn btn-g">
              <span>← Orqaga</span>
            </button>
            <div style={{ flex:1 }}/>
            <span style={{ alignSelf:'center', fontSize:13, color:'var(--t3)' }}>
              <b style={{ color:'var(--t1)' }}>{selectedCount}</b> ta tashkilotga yuboriladi
            </span>
            <button onClick={onSend} className="btn btn-p" disabled={selectedCount === 0}>
              <span>📡 So'rovni jo'natish ({selectedCount})</span>
            </button>
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}

/* ── Step 3: Live tracking ─────────────────────────────────── */
function Step3Tracking({ req, cardBg, onNew }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const fresh = loadRequests().find(r => r.id === req.id);
    if (fresh) Object.assign(req, fresh);
    const id = setInterval(() => {
      const u = loadRequests().find(r => r.id === req.id);
      if (u) Object.assign(req, u);
      setTick(t => t + 1);
    }, 700);
    return () => clearInterval(id);
  }, [req]);

  const accepted = req.responses.filter(r => r.status === 'accepted');
  const declined = req.responses.filter(r => r.status === 'declined');
  const pending  = req.responses.filter(r => r.status === 'pending');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Status header */}
      <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--ok-bg)', border:'1px solid var(--ok-b)', display:'flex', gap:14, alignItems:'flex-start' }}>
        <div style={{ fontSize:30, lineHeight:1 }}>📡</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'var(--ok)', marginBottom:4 }}>
            So'rov {req.vendorIds.length} ta tashkilotga yuborildi
          </div>
          <div style={{ fontSize:12.5, color:'var(--t2)', lineHeight:1.5 }}>
            № <b style={{ fontFamily:'monospace', color:'var(--t1)' }}>{req.reqNo}</b> · {fmtDate(req.createdAt)} · sotuvchilar javobi kutilyapti
          </div>
        </div>
      </div>

      {/* 3 statistic */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <StatusCard ico="✅" label="Qabul qildi"        n={accepted.length} c="#10b981" total={req.vendorIds.length}/>
        <StatusCard ico="❌" label="Rad etdi"             n={declined.length} c="#ef4444" total={req.vendorIds.length}/>
        <StatusCard ico="⏳" label="Javob kutilmoqda"     n={pending.length}  c="#8b5cf6" total={req.vendorIds.length} pulse/>
      </div>

      {/* Vendors list */}
      <BorderGlow backgroundColor={cardBg} glowColor="270 75 70"
        borderRadius={18} glowRadius={48} glowIntensity={1.1} coneSpread={28}
        colors={['#8b5cf6','#06b6d4','#3b82f6']}>
        <div style={{ padding:'24px 26px' }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'var(--t1)', marginBottom:14 }}>📋 Sotuvchilar javoblari</h3>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {req.responses.map(r => {
              const v = VENDORS.find(x => x.id === r.vendorId);
              if (!v) return null;
              const isAccepted = r.status === 'accepted';
              const isDeclined = r.status === 'declined';
              const isPending  = r.status === 'pending';

              return (
                <div key={r.vendorId} style={{
                  padding:'14px 16px', borderRadius:12,
                  background: isAccepted ? 'var(--ok-bg)' : isDeclined ? 'var(--er-bg)' : 'var(--surf2)',
                  border: `1px solid ${isAccepted ? 'var(--ok-b)' : isDeclined ? 'var(--er-b)' : 'var(--brd)'}`,
                  transition:'all .3s',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>
                      {v.name[0]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                        <span style={{ fontSize:14, fontWeight:800, color:'var(--t1)' }}>{v.name}</span>
                        <span style={{ fontSize:11, color:'var(--t3)' }}>★ {v.rating.toFixed(1)} · {v.region}</span>
                        {isAccepted  && <span className="badge badge-ok">✓ Qabul qildi</span>}
                        {isDeclined && <span className="badge badge-er">✕ Rad etdi</span>}
                        {isPending  && <span className="badge badge-info" style={{ display:'inline-flex', alignItems:'center', gap:5 }}><span className="a-spin" style={{ width:8, height:8, borderRadius:'50%', border:'1.5px solid var(--acc)', borderTopColor:'transparent' }}/> Kutilmoqda</span>}
                      </div>
                      {r.message && (
                        <p style={{ fontSize:12.5, color:'var(--t2)', marginTop:5, lineHeight:1.5, fontStyle: isDeclined ? 'italic' : 'normal' }}>
                          💬 {r.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {isAccepted && (
                    <div style={{ display:'flex', gap:8, marginTop:10, paddingTop:10, borderTop:'1px dashed var(--ok-b)', flexWrap:'wrap' }}>
                      <a href={`tel:${v.phone.replace(/\s/g,'')}`} className="btn btn-p" style={{ fontSize:12, padding:'7px 14px', textDecoration:'none' }}>
                        <span>📞 Qo'ng'iroq</span>
                      </a>
                      <a href={`https://wa.me/${v.phone.replace(/[^\d]/g,'')}?text=${encodeURIComponent(`Assalomu alaykum, ${req.reqNo} so'rov bo'yicha bog'lanyapman.`)}`}
                         target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ fontSize:12, padding:'7px 14px', textDecoration:'none', background:'#25D366', color:'#fff', borderColor:'#1da851' }}>
                        <span>💬 WhatsApp</span>
                      </a>
                      <span style={{ marginLeft:'auto', fontSize:11, color:'var(--t3)', fontFamily:'monospace', alignSelf:'center' }}>{v.phone}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', gap:10, marginTop:18, paddingTop:14, borderTop:'1px solid var(--brd)' }}>
            <button onClick={onNew} className="btn btn-g">
              <span>+ Yangi so'rov</span>
            </button>
            {accepted.length > 1 && (
              <span style={{ alignSelf:'center', fontSize:12.5, color:'var(--t3)' }}>
                💡 {accepted.length} ta taklif qabul qilindi — eng yaxshi taklifni tanlash uchun ularni solishtiring
              </span>
            )}
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}

function StatusCard({ ico, label, n, c, total, pulse }) {
  return (
    <div style={{ padding:'16px 18px', borderRadius:14, background:'var(--surf)', border:`1.5px solid ${c}40`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-10, top:-10, fontSize:50, opacity:.08 }}>{ico}</div>
      <div style={{ fontSize:11, fontWeight:800, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:30, fontWeight:900, color: c, marginTop:6, lineHeight:1, animation: pulse && n > 0 ? 'pulse 1.6s ease-in-out infinite' : undefined }}>
        {n} <span style={{ fontSize:14, color:'var(--t3)' }}>/ {total}</span>
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

/* ─────────────────────────────────────────────────────────────
   2. MONITORING — Faol ogohlantirishlar
   ───────────────────────────────────────────────────────────── */
function Monitor({ cardBg }) {
  const high = AI_ALERTS.filter(a => a.level === 'high').length;
  const med  = AI_ALERTS.filter(a => a.level === 'medium').length;
  const low  = AI_ALERTS.filter(a => a.level === 'low').length;

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:22 }}>
        <KPI l="Yuqori xavfli" v={high} x="darhol e'tibor" color="#ef4444" ico="🔴"/>
        <KPI l="O'rta xavfli"   v={med}  x="kuzatuv kerak"  color="#f59e0b" ico="🟠"/>
        <KPI l="Past xavfli"     v={low}  x="kuzatuvda"      color="#3b82f6" ico="🔵"/>
      </div>

      <BorderGlow backgroundColor={cardBg} glowColor="0 80 65"
        borderRadius={18} glowRadius={48} glowIntensity={1.2} coneSpread={28}
        colors={['#ef4444','#f59e0b','#8b5cf6']}>
        <div style={{ padding:'24px 26px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)' }}>🚨 Faol ogohlantirishlar</h3>
            <span className="badge badge-info">{AI_ALERTS.length} ta</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {AI_ALERTS.map((a, i) => {
              const lv = LEVEL[a.level];
              return (
                <div key={a.id} className={`a-pop d${i}`} style={{
                  display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center',
                  padding:'14px 18px', borderRadius:12,
                  background: lv.bg, border:`1px solid ${lv.brd}`,
                }}>
                  <div style={{ fontSize:22 }}>{lv.icon}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:3, flexWrap:'wrap' }}>
                      <span style={{ fontSize:12, fontWeight:800, color: lv.c, textTransform:'uppercase', letterSpacing:'.05em' }}>{a.type}</span>
                      <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'var(--t3)' }}>{a.contract}</span>
                    </div>
                    <div style={{ fontSize:13.5, color:'var(--t1)', fontWeight:500 }}>{a.text}</div>
                  </div>
                  <div style={{ fontSize:11, color:'var(--t3)', fontWeight:600, whiteSpace:'nowrap' }}>{fmtDate(a.date)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </BorderGlow>
    </>
  );
}

function KPI({ l, v, x, color, ico }) {
  return (
    <div className="kpi" style={{ borderLeft: `3px solid ${color}`, position:'relative', overflow:'hidden' }}>
      {ico && <div style={{ position:'absolute', right:-6, top:-6, fontSize:48, opacity:.08 }}>{ico}</div>}
      <div className="kpi-l">{l}</div>
      <div className="kpi-v" style={{ color }}>{v}</div>
      <div className="kpi-x">{x}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. NARX TAHLILI
   ───────────────────────────────────────────────────────────── */
function PriceAnalysis({ cardBg }) {
  const max = Math.max(...AI_PRICE_TREND.map(d => Math.max(d.avg, d.sample)));

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18 }}>

      <BorderGlow backgroundColor={cardBg} glowColor="200 80 65"
        borderRadius={18} glowRadius={50} glowIntensity={1.2} coneSpread={28}
        colors={['#2563eb','#06b6d4','#8b5cf6']}>
        <div style={{ padding:'24px 26px' }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)', marginBottom:6 }}>📊 Narx dinamikasi</h3>
          <p style={{ fontSize:12.5, color:'var(--t3)', marginBottom:20 }}>Bozor o'rtacha narxi vs taklif narxi (indeks: 100 = 2024 Q4)</p>

          <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:240, marginBottom:16, padding:'10px 0' }}>
            {AI_PRICE_TREND.map((d, i) => {
              const anomaly = d.sample > d.avg * 1.20;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end', gap:4, justifyContent:'center' }}>
                    <div style={{ width:14, height:`${(d.avg/max)*100}%`, background:'linear-gradient(180deg,#2563eb,rgba(37,99,235,.5))', borderRadius:'4px 4px 0 0' }}/>
                    <div title={anomaly ? "Anomaliya: 20%+" : ""} style={{
                      width:14, height:`${(d.sample/max)*100}%`,
                      background: anomaly ? 'linear-gradient(180deg,#ef4444,rgba(239,68,68,.5))' : 'linear-gradient(180deg,#06b6d4,rgba(6,182,212,.5))',
                      borderRadius:'4px 4px 0 0',
                      boxShadow: anomaly ? '0 0 14px rgba(239,68,68,.5)' : 'none',
                    }}/>
                  </div>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--t3)', textAlign:'center', whiteSpace:'nowrap' }}>{d.period}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', gap:18, fontSize:12, color:'var(--t2)', flexWrap:'wrap' }}>
            <Legend c="#2563eb" l="Bozor o'rtacha"/>
            <Legend c="#06b6d4" l="Taklif (normal)"/>
            <Legend c="#ef4444" l="Anomaliya (20%+)"/>
          </div>
        </div>
      </BorderGlow>

      <BorderGlow backgroundColor={cardBg} glowColor="0 80 65"
        borderRadius={18} glowRadius={48} glowIntensity={1.1} coneSpread={28}
        colors={['#ef4444','#f59e0b','#8b5cf6']}>
        <div style={{ padding:'24px 26px' }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:'var(--t1)', marginBottom:14 }}>⚠ Aniqlangan anomaliyalar</h3>
          <div style={{ padding:'16px 18px', borderRadius:12, background:'var(--er-bg)', border:'1px solid var(--er-b)', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--er)', textTransform:'uppercase', letterSpacing:'.06em' }}>Anomaliya</div>
            <div style={{ fontSize:24, fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, color:'var(--er)', marginTop:6 }}>+23%</div>
            <div style={{ fontSize:13, color:'var(--t1)', marginTop:6 }}>Q1 2026 da bozor narxidan oshib ketdi</div>
            <div style={{ fontSize:11.5, color:'var(--t3)', marginTop:6 }}>Shartnoma: <b style={{ color:'var(--t2)', fontFamily:'monospace' }}>GK-2026-0058</b></div>
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}

function Legend({ c, l }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
      <span style={{ width:10, height:10, borderRadius:3, background:c }}/>
      {l}
    </div>
  );
}
