import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { DatabaseSync } from 'node:sqlite';

const KOK = join(process.env.USERPROFILE || '', '.claude-mem');
const DB = join(KOK, 'claude-mem.db');
const GUN = 86400;
const SIMDI = Math.floor(Date.now() / 1000);
const HOT_GUN = 30;
const WARM_GUN = 120;
const MAX_GORUNUM = 25000;
const LOG_GUN = 14;
const YEDEK_ADET = 3;
const PENDING_GUN = 7;
const uygula = process.argv.includes('--uygula');
const arsivle = process.argv.includes('--arsivle');
const gozlemSil = process.argv.includes('--gozlem-sil');

function boyut(p) {
  if (!existsSync(p)) return 0;
  const st = statSync(p);
  if (!st.isDirectory()) return st.size;
  return readdirSync(p).reduce((t, a) => t + boyut(join(p, a)), 0);
}
const mb = (b) => (b / 1048576).toFixed(1) + ' MB';

function ac() {
  const h = new DatabaseSync(DB, { readOnly: !uygula });
  h.exec('PRAGMA busy_timeout = 5000');
  return h;
}

function rapor(h) {
  const tek = (sql) => h.prepare(sql).all();
  const say = (sql) => h.prepare(sql).get().n;
  console.log('== claude-mem durumu ==');
  console.log('gözlem: ' + say('SELECT COUNT(*) n FROM observations') + ' | özet: ' + say('SELECT COUNT(*) n FROM session_summaries') + ' | oturum: ' + say('SELECT COUNT(*) n FROM sdk_sessions'));
  console.log('yaş: ' + tek("SELECT CASE WHEN created_at_epoch > " + (SIMDI - HOT_GUN * GUN) + " THEN '0-30g' WHEN created_at_epoch > " + (SIMDI - WARM_GUN * GUN) + " THEN '31-120g' ELSE '120g+' END k, COUNT(*) n FROM observations GROUP BY k").map((r) => r.k + '=' + r.n).join(', '));
  console.log('tip: ' + tek('SELECT type, COUNT(*) n FROM observations GROUP BY type ORDER BY n DESC LIMIT 6').map((r) => r.type + '=' + r.n).join(', '));
  console.log('kod bağı olan gözlem: ' + say("SELECT COUNT(*) n FROM observations WHERE files_modified IS NOT NULL AND files_modified <> '' AND files_modified <> '[]'"));
  console.log('bekleyen mesaj: ' + say('SELECT COUNT(*) n FROM pending_messages'));
  console.log('boyut: db=' + mb(boyut(DB)) + ' chroma=' + mb(boyut(join(KOK, 'chroma'))) + ' log=' + mb(boyut(join(KOK, 'logs'))) + ' yedek=' + mb(boyut(join(KOK, 'backups'))));
}

function temizle(h) {
  let kazanç = 0;
  const logDir = join(KOK, 'logs');
  if (existsSync(logDir)) {
    for (const a of readdirSync(logDir)) {
      const p = join(logDir, a);
      const st = statSync(p);
      if (st.isFile() && st.mtimeMs < Date.now() - LOG_GUN * GUN * 1000) {
        kazanç += st.size;
        rmSync(p, { force: true });
      }
    }
  }
  const yedekDir = join(KOK, 'backups');
  if (existsSync(yedekDir)) {
    const dosyalar = readdirSync(yedekDir).map((a) => join(yedekDir, a)).filter((p) => statSync(p).isFile()).sort((x, y) => statSync(y).mtimeMs - statSync(x).mtimeMs);
    for (const p of dosyalar.slice(YEDEK_ADET)) {
      kazanç += statSync(p).size;
      rmSync(p, { force: true });
    }
  }
  const silinen = h.prepare('DELETE FROM pending_messages WHERE status <> ? AND created_at_epoch < ?').run('pending', SIMDI - PENDING_GUN * GUN);
  console.log('temizlik: log/yedek=' + mb(kazanç) + ' bekleyen_silinen=' + Number(silinen.changes));
}

function arsiv(h) {
  const sinir = SIMDI - WARM_GUN * GUN;
  const fazla = h.prepare('SELECT COUNT(*) n FROM observations').get().n - MAX_GORUNUM;
  let satirlar = h.prepare('SELECT * FROM observations WHERE created_at_epoch < ? ORDER BY created_at_epoch').all(sinir);
  if (satirlar.length < Math.max(fazla, 0)) {
    const adet = Math.max(fazla, 0) - satirlar.length;
    satirlar = satirlar.concat(h.prepare('SELECT * FROM observations ORDER BY created_at_epoch LIMIT ?').all(adet));
  }
  if (!satirlar.length) {
    console.log('arşiv: sınırı aşan gözlem yok (sıcak ' + HOT_GUN + 'g, ılık ' + WARM_GUN + 'g, üst sınır ' + MAX_GORUNUM + ')');
    return;
  }
  const dir = join(KOK, 'arsiv');
  mkdirSync(dir, { recursive: true });
  const ad = join(dir, new Date().toISOString().slice(0, 10) + '-' + satirlar.length + '.jsonl.gz');
  writeFileSync(ad, gzipSync(Buffer.from(satirlar.map((r) => JSON.stringify(r)).join('\n'))));
  console.log('arşiv: ' + satirlar.length + ' gözlem -> ' + ad);
  if (!gozlemSil) {
    console.log('silme yapılmadı; onay için --gozlem-sil (chroma yeniden indeksleme doğrulanmadan çalıştırma)');
    return;
  }
  const ids = satirlar.map((r) => r.id);
  const q = h.prepare('DELETE FROM observations WHERE id = ?');
  for (const id of ids) q.run(id);
  console.log('silinen: ' + ids.length);
}

const h = ac();
rapor(h);
if (arsivle) arsiv(h);
if (uygula) temizle(h);
h.close();
