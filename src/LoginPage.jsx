import React, { useState } from 'react';
import { login } from './utils/auth';

export default function LoginPage({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const user = await login(u.trim(), p);
      onLogin(user);
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  }

  const DEMO = [
    { u:'admin',    p:'admin123', l:'Administrator'  },
    { u:'buyurtma', p:'demo123',  l:'Buyurtmachi'    },
    { u:'sotuvchi', p:'demo123',  l:'Sotuvchi'       },
    { u:'nazorat',  p:'demo123',  l:'Nazorat organi' },
  ];

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'40px 20px', position:'relative',
      background:'radial-gradient(circle at 20% 20%, rgba(37,99,235,.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(6,182,212,.14), transparent 55%), #050b1a',
    }}>
      {/* Decorative grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'linear-gradient(rgba(59,130,246,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.06) 1px, transparent 1px)',
        backgroundSize:'48px 48px', pointerEvents:'none',
      }}/>

      <div className="a-pop" style={{
        position:'relative', zIndex:1,
        width:'100%', maxWidth:440,
        background:'rgba(8,18,42,.85)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(59,130,246,.30)', borderRadius:22,
        padding:'40px 36px', boxShadow:'0 24px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(59,130,246,.15)',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginBottom:8 }}>
          <div style={{
            width:54, height:54, borderRadius:14,
            background:'linear-gradient(135deg,#2563eb,#06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:900, fontSize:24,
            boxShadow:'0 8px 28px rgba(37,99,235,.5)',
          }}>T</div>
        </div>
        <h1 style={{
          textAlign:'center', fontFamily:"'Space Grotesk',sans-serif",
          fontSize:30, fontWeight:900, letterSpacing:'-.03em', marginTop:18,
          background:'linear-gradient(135deg,#3b82f6,#22d3ee)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>TenderTrack</h1>
        <p style={{ textAlign:'center', fontSize:12.5, color:'#5a7499', marginTop:6, marginBottom:30, letterSpacing:'.04em' }}>
          Davlat xaridlari ochiqligi · AI reyting platformasi
        </p>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <label style={{ fontSize:12, fontWeight:700, color:'#a8c4e0', letterSpacing:'.04em' }}>FOYDALANUVCHI</label>
          <input className="inp" placeholder="Login" value={u} onChange={e=>setU(e.target.value)} autoFocus
            style={{ background:'rgba(5,11,26,.6)', borderColor:'rgba(59,130,246,.25)', color:'#f0f6ff' }}/>

          <label style={{ fontSize:12, fontWeight:700, color:'#a8c4e0', letterSpacing:'.04em', marginTop:6 }}>PAROL</label>
          <input className="inp" type="password" placeholder="••••••••" value={p} onChange={e=>setP(e.target.value)}
            style={{ background:'rgba(5,11,26,.6)', borderColor:'rgba(59,130,246,.25)', color:'#f0f6ff' }}/>

          {err && (
            <div className="a-su" style={{
              padding:'10px 14px', borderRadius:10, fontSize:13,
              background:'rgba(251,113,133,.14)', border:'1px solid rgba(251,113,133,.4)',
              color:'#fb7185',
            }}>⚠ {err}</div>
          )}

          <button type="submit" disabled={loading || !u || !p} className="btn btn-p btn-lg" style={{ marginTop:10 }}>
            <span>{loading ? '⏳ Tekshirilmoqda…' : 'Kirish →'}</span>
          </button>
        </form>

        <div style={{ marginTop:28, paddingTop:22, borderTop:'1px dashed rgba(59,130,246,.22)' }}>
          <p style={{ fontSize:11, color:'#5a7499', letterSpacing:'.06em', textAlign:'center', marginBottom:10, textTransform:'uppercase', fontWeight:700 }}>
            Demo akkauntlar
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {DEMO.map(d => (
              <button key={d.u} type="button" onClick={() => { setU(d.u); setP(d.p); }}
                style={{
                  padding:'9px 10px', borderRadius:9,
                  background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.22)',
                  cursor:'pointer', textAlign:'left', transition:'all .2s',
                  color:'#a8c4e0',
                }}
                onMouseOver={e => e.currentTarget.style.background='rgba(59,130,246,.16)'}
                onMouseOut={e  => e.currentTarget.style.background='rgba(59,130,246,.08)'}>
                <div style={{ fontSize:12, fontWeight:700, color:'#60a5fa' }}>{d.l}</div>
                <div style={{ fontSize:10.5, fontFamily:'monospace', color:'#5a7499', marginTop:2 }}>
                  {d.u} · {d.p}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
