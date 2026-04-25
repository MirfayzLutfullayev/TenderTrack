const TOKEN_KEY = 'tendertrack_token';
const USER_KEY  = 'tendertrack_user';

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export async function login(username, password) {
  const DEMO = [
    { username:'admin',     password:'admin123',  full_name:"Administrator",            role:"Administrator",     org:"TenderTrack" },
    { username:'buyurtma',  password:'demo123',   full_name:"A. Karimov",               role:"Buyurtmachi",       org:"O'zbekiston Respublikasi Sog'liqni saqlash vazirligi" },
    { username:'sotuvchi',  password:'demo123',   full_name:"M. Rahimova",              role:"Sotuvchi tashkilot", org:"\"BuildPro\" MChJ" },
    { username:'nazorat',   password:'demo123',   full_name:"S. Yusupov",               role:"Nazorat organi",    org:"Hisob palatasi" },
  ];
  const user = DEMO.find(u => u.username === username && u.password === password);
  if (!user) throw new Error("Login yoki parol noto'g'ri");
  localStorage.setItem(TOKEN_KEY, btoa(username + ':' + Date.now()));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}
