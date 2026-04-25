// App.jsx — TenderTrack: Davlat xaridlari shaffofligi platformasi
import React, { useState, useEffect } from 'react';

import ProfilePage   from './pages/ProfilePage';
import VendorsPage   from './pages/VendorsPage';
import ContractsPage from './pages/ContractsPage';
import AIPage        from './pages/AIPage';
import LoginPage     from './LoginPage';
import { isLoggedIn, getUser, logout } from './utils/auth';

/* ── Logo ─────────────────────────────────────────────────── */
const Logo = ({ onClick }) => (
  <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer' }}>
    <div style={{
      width:36, height:36, borderRadius:10, flexShrink:0,
      background:'linear-gradient(135deg,#2563eb,#06b6d4)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontFamily:'Space Grotesk', fontWeight:800, fontSize:18,
      boxShadow:'0 4px 16px rgba(37,99,235,.4)',
    }}>T</div>
    <div>
      <div style={{
        fontSize:15, fontFamily:'Space Grotesk', fontWeight:800,
        letterSpacing:'-.03em', lineHeight:1,
        background:'linear-gradient(135deg,#2563eb,#06b6d4)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
      }}>TenderTrack</div>
      <div style={{ fontSize:9, color:'var(--t3)', letterSpacing:'.1em', marginTop:1, fontWeight:600 }}>
        DAVLAT XARIDLARI · AI
      </div>
    </div>
  </div>
);

/* ── NAV ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id:'profile',   label:'Shaxsiy Profil',  icon:'👤' },
  { id:'vendors',   label:'Sotuvchilar',     icon:'🏢' },
  { id:'contracts', label:'Shartnomalar',    icon:'📄' },
  { id:'ai',        label:'AI Tahlil',       icon:'🧠' },
];

export default function App() {
  const [page, setPage] = useState('profile');
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(() => isLoggedIn() ? getUser() : null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  if (!user) {
    return (
      <div data-theme={dark ? 'dark' : 'light'}>
        <LoginPage onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  const handleLogout = () => { logout(); setUser(null); setPage('profile'); };
  const nav = (p) => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); };

  return (
    <div data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight:'100vh', position:'relative', transition:'background .35s' }}>

      {/* ── GLOBAL BACKGROUND ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <div style={{
          position:'absolute', inset:0,
          background: dark
            ? 'radial-gradient(circle at 15% 10%, rgba(37,99,235,.14), transparent 50%), radial-gradient(circle at 85% 85%, rgba(6,182,212,.10), transparent 55%), #050b1a'
            : '#f8fafc',
          transition: 'background .35s',
        }}/>
        {dark && (
          <div style={{
            position:'absolute', inset:0, opacity:.4,
            backgroundImage:'linear-gradient(rgba(59,130,246,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.05) 1px, transparent 1px)',
            backgroundSize:'56px 56px',
          }}/>
        )}
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar" style={{ position:'sticky', zIndex:100 }}>
        <div className="nav-wrap">
          <Logo onClick={() => nav('profile')}/>
          <div style={{ display:'flex', gap:2 }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id}
                className={`nav-link${page === n.id ? ' on' : ''}`}
                onClick={() => nav(n.id)}>
                <span style={{ marginRight:6 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="tgl" onClick={() => setDark(d => !d)} title="Mavzu">
              <div className="tgl-k">{dark ? '🌙' : '☀️'}</div>
            </button>
            <div style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'5px 11px', borderRadius:10,
              background:'var(--surf2)', border:'1px solid var(--brd)',
            }}>
              <div style={{
                width:24, height:24, borderRadius:7,
                background:'linear-gradient(135deg,#2563eb,#06b6d4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:800, color:'#fff',
              }}>
                {(user.full_name || user.username || 'U')[0].toUpperCase()}
              </div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--t1)' }}>{user.full_name}</span>
                <span style={{ fontSize:9, color:'var(--t3)', letterSpacing:'.04em', textTransform:'uppercase' }}>{user.role}</span>
              </div>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 5px #10b981', marginLeft:4 }}/>
            </div>
            <button title="Chiqish" onClick={handleLogout} style={{
              width:34, height:34, borderRadius:9,
              background:'var(--er-bg)', border:'1px solid var(--er-b)',
              cursor:'pointer', padding:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all .2s', color:'var(--er)',
            }}
              onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,.18)'}
              onMouseOut={e  => e.currentTarget.style.background='var(--er-bg)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── PAGES ── */}
      <main style={{ position:'relative', zIndex:1 }}>
        {page === 'profile'   && <ProfilePage   navigateTo={nav} dark={dark}/>}
        {page === 'vendors'   && <VendorsPage   navigateTo={nav} dark={dark}/>}
        {page === 'contracts' && <ContractsPage navigateTo={nav} dark={dark}/>}
        {page === 'ai'        && <AIPage        navigateTo={nav} dark={dark}/>}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        position:'relative', zIndex:1, marginTop:60,
        borderTop:`1px solid ${dark?'rgba(37,99,235,.18)':'#e2e8f0'}`,
        background: dark?'rgba(5,11,26,.85)':'#ffffff',
        backdropFilter: dark?'blur(14px)':'none',
        padding:'28px',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:7, background:'linear-gradient(135deg,#2563eb,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:800 }}>T</div>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>TenderTrack</span>
            <span style={{ fontSize:12, color:'var(--t3)' }}>· Davlat xaridlari ochiqligi · 2026</span>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['Shaffoflik','AI Reyting','Real-vaqt','Ochiq ma\'lumot'].map(t => (
              <span key={t} className="badge badge-info">{t}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
