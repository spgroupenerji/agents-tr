import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
let kok;
try {
  kok = git('rev-parse', '--show-toplevel');
} catch {
  console.error('Hata: git deposu değil.');
  process.exit(2);
}
const dir = join(kok, 'docs', 'kararlar');
const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = {};
const kodlar = [];
for (let i = 1; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) continue;
  const k = a.slice(2);
  if (k === 'kod') { kodlar.push(argv[++i]); continue; }
  opt[k] = argv[++i];
}
const simdi = new Date();
const p2 = (n) => String(n).padStart(2, '0');
const ofset = -simdi.getTimezoneOffset();
const iso = simdi.getFullYear() + '-' + p2(simdi.getMonth() + 1) + '-' + p2(simdi.getDate()) + 'T' + p2(simdi.getHours()) + ':' + p2(simdi.getMinutes()) + ':' + p2(simdi.getSeconds()) + (ofset >= 0 ? '+' : '-') + p2(Math.floor(Math.abs(ofset) / 60)) + ':' + p2(Math.abs(ofset) % 60);
const damga = iso.slice(0, 4) + iso.slice(5, 7) + iso.slice(8, 10) + iso.slice(11, 13) + iso.slice(14, 16);
const slug = (s) => (s || 'karar').toLocaleLowerCase('tr').replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

function oku(p) {
  const t = readFileSync(p, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  for (const s of (m ? m[1] : '').split(/\r?\n/)) {
    const i = s.indexOf(':');
    if (i < 0) continue;
    const k = s.slice(0, i).trim();
    let v = s.slice(i + 1).trim();
    if (v.startsWith('[')) { try { v = JSON.parse(v); } catch {} }
    else v = v.replace(/^"|"$/g, '');
    fm[k] = v;
  }
  return fm;
}
const dosyalar = () => (existsSync(dir) ? readdirSync(dir).filter((a) => a.endsWith('.md') && a !== 'README.md') : []);

if (cmd === 'ekle') {
  if (!opt.baslik || !opt.karar) { console.error('Kullanım: ekle --baslik "..." --karar "..." [--kod yol[:satır]] [--tur mimari] [--ust id] [--kaynak ...]'); process.exit(2); }
  const sha = git('rev-parse', '--short', 'HEAD');
  const refs = kodlar.map((k) => {
    const m = k.match(/^(.+?)(?::(\d+))?$/);
    const yol = m[1];
    const satir = m[2] ? ':' + m[2] : '';
    if (!existsSync(join(kok, yol))) { console.error('Hata: kod yolu yok -> ' + yol); process.exit(1); }
    return yol + satir + '@' + sha;
  });
  const id = damga + '-' + slug(opt.baslik);
  const hedef = join(dir, id + '.md');
  mkdirSync(dir, { recursive: true });
  const icerik = ['---', 'id: ' + id, 'baslik: "' + opt.baslik.replace(/"/g, "'") + '"', 'tarih: ' + iso, 'durum: aktif', 'tur: ' + (opt.tur || 'karar'), 'ust: "' + (opt.ust || '') + '"', 'kaynak: "' + (opt.kaynak || 'oturum') + '"', 'kod: ' + JSON.stringify(refs), '---', '', '# ' + opt.baslik, '', opt.karar, '', '## Kod bağı', '', refs.length ? refs.map((r) => '- ' + r.split('@')[0]).join('\n') : '- Yok', ''].join('\n');
  writeFileSync(hedef, icerik, 'utf8');
  console.log('eklendi: ' + id);
} else if (cmd === 'liste') {
  for (const a of dosyalar()) {
    const fm = oku(join(dir, a));
    console.log([fm.durum, fm.tarih?.slice(0, 16), fm.id, (fm.kod || []).length + ' kod', fm.baslik].join(' | '));
  }
} else if (cmd === 'denetle') {
  const hepsi = dosyalar().map((a) => ({ a, fm: oku(join(dir, a)) }));
  const idler = new Set(hepsi.map((x) => x.fm.id));
  const hatalar = [];
  const uyarilar = [];
  for (const { a, fm } of hepsi) {
    if (fm.durum !== 'aktif') continue;
    for (const ref of fm.kod || []) {
      const i = ref.lastIndexOf('@');
      const yol = i > 0 ? ref.slice(0, i) : ref;
      const sha = i > 0 ? ref.slice(i + 1) : '';
      const dosya = yol.split(':')[0];
      if (!existsSync(join(kok, dosya))) { hatalar.push(fm.id + ': kod yok -> ' + dosya); continue; }
      if (sha) { try { git('cat-file', '-e', sha + '^{commit}'); } catch { hatalar.push(fm.id + ': commit yok -> ' + sha); } }
      const degisen = git('log', '--since=' + fm.tarih, '--format=%h', '--', dosya);
      if (degisen) uyarilar.push(fm.id + ': ' + dosya + ' karardan sonra değişti (' + degisen.split('\n').length + ' commit)');
    }
    if (fm.ust && !idler.has(fm.ust)) hatalar.push(fm.id + ': üst kayıt yok -> ' + fm.ust);
  }
  for (const u of uyarilar) console.log('UYARI ' + u);
  for (const h of hatalar) console.log('HATA  ' + h);
  console.log('karar: ' + hepsi.length + ' | uyarı: ' + uyarilar.length + ' | hata: ' + hatalar.length);
  process.exit(hatalar.length ? 1 : 0);
} else {
  console.log('Kullanım: karar.mjs ekle|liste|denetle|gecersiz');
  process.exit(2);
}
