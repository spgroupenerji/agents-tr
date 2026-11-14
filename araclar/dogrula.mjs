import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const hatalar = [];
const hata = (m) => hatalar.push(m);
const oku = (p) => readFileSync(join(KOK, p), 'utf8');

const mdDosyalari = [];
function tara(dir) {
  for (const ad of readdirSync(join(KOK, dir))) {
    if (ad.startsWith('.')) continue;
    const goreli = dir ? dir + '/' + ad : ad;
    const tam = join(KOK, goreli);
    if (statSync(tam).isDirectory()) tara(goreli);
    else if (ad.endsWith('.md')) mdDosyalari.push(goreli);
  }
}
tara('');

const readme = oku('README.md');
const satirlar = readme.split(/\r?\n/);
const damgaDesen = /^version:\s*"(.+)"$/m;

if (existsSync(join(KOK, 'AGENTS.md'))) hata('Depo kökünde AGENTS.md olmamalı (araç çakışması)');

for (const d of mdDosyalari) {
  const metin = oku(d);
  if (!metin.startsWith('---')) continue;
  const m = metin.match(damgaDesen);
  if (!m) {
    hata('Frontmatter sürüm damgası yok: ' + d);
    continue;
  }
  const damga = m[1];
  if (!/^v\d{12}$/.test(damga)) hata('Geçersiz sürüm damgası: ' + d + ' -> ' + damga);
  const anahtar = d === 'README.md' ? 'README.md' : d.endsWith('/README.md') ? d.slice(0, d.length - 9) : d;
  const satir = satirlar.find((s) => s.startsWith('|') && s.includes(anahtar));
  if (!satir || !satir.includes(damga)) hata('Katalog satırı eksik veya damga farklı: ' + anahtar + ' -> ' + damga);
  try {
    if (!execFileSync('git', ['tag', '--list', damga], { cwd: KOK }).toString().trim()) hata('Release tag eksik: ' + damga);
  } catch {
    hata('git tag kontrolü çalışmadı: ' + damga);
  }
}

const tr = oku('AGENTS-tr.md');
const en = oku('AGENTS-en.md');
const trDamga = (tr.match(damgaDesen) || [])[1];
const enDamga = (en.match(damgaDesen) || [])[1];
if (!trDamga || trDamga !== enDamga) hata('Çeviri damgası kaynakla eşleşmiyor: ' + trDamga + ' -> ' + enDamga);
const numara = (t, desen) => [...t.matchAll(desen)].map((x) => x[1]).join(',');
if (numara(tr, /^(\d+\.\d+)\.\s/gm) !== numara(en, /^(\d+\.\d+)\.\s/gm)) hata('Çeviri kural numaraları eşleşmiyor');
if (numara(tr, /^## (\d+)\./gm) !== numara(en, /^## (\d+)\./gm)) hata('Çeviri bölüm numaraları eşleşmiyor');
if (!tr.includes('Türkçe iletişim')) hata('Türkçe kaynakta Türkçe iletişim kuralı yok');
if (!en.includes('communicate with me in Turkish')) hata('İngilizce çeviride Türkçe iletişim kuralı yok');

const aracAdlari = ['codegraph', 'gitnexus', 'graphify', 'trail-code', 'ripwire', 'serena', 'trace-mcp', 'context-mode', 'claude-mem', 'context7'];
for (const [ad, metin] of [['AGENTS-tr.md', tr], ['AGENTS-en.md', en]]) {
  for (const no of ['1', '10']) {
    const satir = (metin.match(new RegExp('^4\\.' + no + '\\. .*$', 'm')) || [''])[0].toLowerCase();
    for (const arac of aracAdlari) if (satir.includes(arac)) hata('§4.' + no + ' araç adı taşımamalı: ' + ad + ' -> ' + arac);
  }
}

const urlDesen = /https?:\/\/[^\s)\]]+/g;
for (const d of readdirSync(KOK)) {
  const tam = join(KOK, d);
  if (d.startsWith('.') || !statSync(tam).isDirectory()) continue;
  const r = join(d, 'README.md');
  const l = join(d, 'linkler.md');
  if (!existsSync(join(KOK, r)) || !existsSync(join(KOK, l))) continue;
  const a = (oku(r).match(urlDesen) || []).join('|');
  const b = (oku(l).match(urlDesen) || []).join('|');
  if (a !== b) hata('Bağlantı listesi README ile eşleşmiyor: ' + d);
}

for (const d of mdDosyalari) {
  for (const m of oku(d).matchAll(/\]\(([^)#][^)]*)\)/g)) {
    const hedef = m[1].split('#')[0];
    if (/^(https?:\/\/|mailto:)/.test(hedef)) continue;
    if (!existsSync(join(KOK, dirname(d), hedef))) hata('Kırık iç link: ' + d + ' -> ' + m[1]);
  }
}

if (process.argv.includes('--cevre')) {
  const ev = process.env.USERPROFILE || '';
  const cfg = join(ev, '.dsh', 'cordis.patch.yml');
  if (existsSync(cfg)) {
    const t = readFileSync(cfg, 'utf8');
    const aktif = [...t.matchAll(/^\s{8}serverName:\s*(\S+)/gm)].map((m) => m[1]);
    const kapali = [...t.matchAll(/^\s*#\s+serverName:\s*(\S+)/gm)].map((m) => m[1]);
    const tekrar = [...new Set(aktif.filter((x, i) => aktif.indexOf(x) !== i))];
    if (tekrar.length) hata('Aynı MCP sunucusu iki kez tanımlı: ' + tekrar.join(', '));
    if (t.includes("args: ['/c', 'context-mode']")) hata("context-mode başlatma komutu 'server' alt komutunu içermiyor");
    console.log('MCP aktif=' + aktif.length + ' (' + aktif.join(', ') + ') kapalı=' + (kapali.join(', ') || 'yok'));
  }
  const pidDosya = join(ev, '.trace', 'daemon.pid');
  if (existsSync(pidDosya)) {
    const pid = Number(readFileSync(pidDosya, 'utf8').trim());
    try {
      process.kill(pid, 0);
      console.log('UYARI: trace daemon çalışıyor (pid ' + pid + '); bütçe kuralı tek daemon.');
    } catch {
      console.log('trace daemon kapalı.');
    }
  }
  console.log('Ortam denetimi bitti.');
}

if (hatalar.length) {
  console.error('Doğrulama başarısız (' + hatalar.length + '):');
  for (const h of hatalar) console.error(' - ' + h);
  process.exit(1);
}
console.log('Doğrulama geçti: ' + mdDosyalari.length + ' belge; damga, katalog, tag, TR-EN paritesi, bağlantı ve araç adı denetimi temiz');
