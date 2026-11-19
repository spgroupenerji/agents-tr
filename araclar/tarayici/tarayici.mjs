import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIZIN = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.join(os.homedir(), '.agents');
const CONFIG_YOLU = path.join(KOK, 'tarayici.json');
const KAYIT_YOLU = path.join(KOK, 'tarayici-surec.json');
const MODLAR = ['mevcut', 'izole', 'harici'];
const SS_YOLLARI = ['ss', '/usr/sbin/ss', '/sbin/ss'];
const SAGLIK_ZAMAN_ASIMI_MS = 2000;
const ACILIS_SURE_MS = 20000;
const ACILIS_ADIM_MS = 500;
const KAPATMA_SURE_MS = 5000;
const KAPATMA_ZORLA_SURE_MS = 2000;
const BEKLEME_ADIM_MS = 100;
const EN_BUYUK_PORT = 65535;
const JSON_GIRINTI = 2;

function jsonOku(yol) {
    let ham;
    try {
        ham = fs.readFileSync(yol, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') return null;
        throw new Error('Dosya okunamadi (' + yol + '): ' + e.message);
    }
    if (ham.charCodeAt(0) === 0xFEFF) ham = ham.slice(1);
    if (!ham.trim()) return null;
    try {
        return JSON.parse(ham);
    } catch (e) {
        throw new Error('JSON cozulemedi (' + yol + '): ' + e.message);
    }
}

function jsonYaz(yol, nesne) {
    fs.mkdirSync(path.dirname(yol), { recursive: true });
    const gecici = yol + '.' + process.pid + '.tmp';
    fs.writeFileSync(gecici, JSON.stringify(nesne, null, JSON_GIRINTI) + '\n', 'utf8');
    fs.renameSync(gecici, yol);
}

function sayiDogrula(deger, ad, alt, ust) {
    if (!Number.isInteger(deger) || deger < alt || deger > ust) throw new Error(ad + ' gecersiz: ' + deger);
    return deger;
}

function configAl() {
    const ham = jsonOku(CONFIG_YOLU);
    if (!ham || typeof ham !== 'object' || Array.isArray(ham)) throw new Error('Tarayici config yok: ' + CONFIG_YOLU);
    const uygulama = ham.uygulama;
    if (typeof uygulama !== 'string' || !path.isAbsolute(uygulama)) throw new Error('Config uygulama mutlak yol olmali: ' + String(uygulama));
    let bilgi;
    try {
        bilgi = fs.statSync(uygulama);
    } catch (e) {
        throw new Error('Uygulama bulunamadi: ' + uygulama);
    }
    if (!bilgi.isFile()) throw new Error('Uygulama dosya degil: ' + uygulama);
    try {
        fs.accessSync(uygulama, fs.constants.X_OK);
    } catch (e) {
        throw new Error('Uygulama calistirilamaz: ' + uygulama);
    }
    const mod = ham.mod;
    if (!MODLAR.includes(mod)) throw new Error('Config mod gecersiz: ' + String(mod));
    if (ham.port !== undefined) sayiDogrula(Number(ham.port), 'Config port', 0, EN_BUYUK_PORT);
    const aralik = ham.portAraligi;
    if (!aralik || typeof aralik !== 'object') throw new Error('Config portAraligi yok');
    const alt = sayiDogrula(Number(aralik.alt), 'Config portAraligi.alt', 1, EN_BUYUK_PORT);
    const ust = sayiDogrula(Number(aralik.ust), 'Config portAraligi.ust', 1, EN_BUYUK_PORT);
    if (alt > ust) throw new Error('Config port araligi gecersiz: ' + alt + '-' + ust);
    const profilKok = ham.profilKok;
    if (mod === 'izole' && (typeof profilKok !== 'string' || !path.isAbsolute(profilKok))) throw new Error('Config profilKok mutlak yol olmali: ' + String(profilKok));
    const profil = ham.profil;
    if (profil !== undefined && (typeof profil !== 'string' || !path.isAbsolute(profil) || !profil.trim())) throw new Error('Config profil mutlak yol olmali: ' + String(profil));
    return {
        uygulama,
        mod,
        portAraligi: { alt, ust },
        profilKok: typeof profilKok === 'string' ? profilKok : '',
        profil: typeof profil === 'string' ? profil : ''
    };
}

function kayitAl() {
    const ham = jsonOku(KAYIT_YOLU);
    if (ham === null) return [];
    if (Array.isArray(ham)) return ham;
    if (typeof ham === 'object') return [ham];
    throw new Error('Kayit bicimi gecersiz: ' + KAYIT_YOLU);
}

function kayitYaz(liste) {
    jsonYaz(KAYIT_YOLU, liste);
}

function kayitEkle(kayit) {
    const liste = kayitAl();
    liste.push(kayit);
    kayitYaz(liste);
    return kayit;
}

function devtoolsSaglikli(port) {
    const sayi = Number(port);
    if (!Number.isInteger(sayi) || sayi <= 0 || sayi > EN_BUYUK_PORT) return Promise.resolve(false);
    return new Promise((cozum) => {
        const istek = http.get({ host: '127.0.0.1', port: sayi, path: '/json/version', timeout: SAGLIK_ZAMAN_ASIMI_MS }, (yanit) => {
            yanit.resume();
            cozum(yanit.statusCode === 200);
        });
        istek.on('timeout', () => {
            istek.destroy();
            cozum(false);
        });
        istek.on('error', () => cozum(false));
    });
}

function surecCanli(pid) {
    const sayi = Number(pid);
    if (!Number.isInteger(sayi) || sayi <= 0) return false;
    try {
        process.kill(sayi, 0);
    } catch (e) {
        return e.code === 'EPERM';
    }
    if (process.platform !== 'linux') return true;
    try {
        const ham = fs.readFileSync('/proc/' + sayi + '/stat', 'utf8');
        return !ham.slice(ham.lastIndexOf(')') + 2).startsWith('Z');
    } catch (e) {
        return true;
    }
}

function surecYolu(pid) {
    const sayi = Number(pid);
    if (!Number.isInteger(sayi) || sayi <= 0) return '';
    try {
        return fs.readlinkSync('/proc/' + sayi + '/exe').replace(/ \(deleted\)$/, '');
    } catch (e) {
        if (process.platform === 'linux') return '';
    }
    try {
        return execFileSync('ps', ['-o', 'comm=', '-p', String(sayi)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (e) {
        return '';
    }
}

function kanonikYol(yol) {
    if (!yol) return '';
    try {
        return fs.realpathSync(yol);
    } catch (e) {
        return path.resolve(String(yol));
    }
}

function yolEsit(a, b) {
    if (process.platform === 'darwin') return a.toLowerCase() === b.toLowerCase();
    return a === b;
}

function ayniUygulama(pid, uygulama) {
    if (!surecCanli(pid)) return false;
    const yol = surecYolu(pid);
    if (!yol) return false;
    return yolEsit(kanonikYol(yol), kanonikYol(uygulama));
}

function lsofPid(port) {
    let cikti = '';
    try {
        cikti = execFileSync('lsof', ['-nP', '-iTCP:' + port, '-sTCP:LISTEN', '-t'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
        if (e.code === 'ENOENT') return 0;
        cikti = typeof e.stdout === 'string' ? e.stdout : '';
    }
    for (const satir of cikti.split('\n')) {
        const deger = Number(satir.trim());
        if (Number.isInteger(deger) && deger > 0) return deger;
    }
    return 0;
}

function ssCikti() {
    for (const arac of SS_YOLLARI) {
        try {
            return execFileSync(arac, ['-ltnp'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
        } catch (e) {
            if (e.code === 'ENOENT') continue;
            if (typeof e.stdout === 'string' && e.stdout.trim()) return e.stdout;
            return null;
        }
    }
    return null;
}

function ssDurum(port) {
    const cikti = ssCikti();
    if (cikti === null) return { durum: 'bos', pid: 0 };
    const desen = new RegExp(':' + port + '\\s');
    for (const satir of cikti.split('\n')) {
        if (!desen.test(satir)) continue;
        const eslesme = satir.match(/pid=(\d+)/);
        if (eslesme) return { durum: 'sahipli', pid: Number(eslesme[1]) };
        return { durum: 'bilinmiyor', pid: 0 };
    }
    return { durum: 'bos', pid: 0 };
}

function portSahibi(port) {
    const sayi = Number(port);
    if (!Number.isInteger(sayi) || sayi <= 0 || sayi > EN_BUYUK_PORT) return { durum: 'bos', pid: 0 };
    const pid = lsofPid(sayi);
    if (pid) return { durum: 'sahipli', pid };
    return ssDurum(sayi);
}

function grupOldur(pid, sinyal) {
    const sayi = Number(pid);
    try {
        process.kill(-sayi, sinyal);
        return true;
    } catch (e) {
        try {
            process.kill(sayi, sinyal);
            return true;
        } catch (sonHata) {
            return false;
        }
    }
}

function uyu(ms) {
    return new Promise((cozum) => setTimeout(cozum, ms));
}

async function kapanmaBekle(pid, sure) {
    const bitis = Date.now() + sure;
    while (Date.now() < bitis) {
        if (!surecCanli(pid)) return true;
        await uyu(BEKLEME_ADIM_MS);
    }
    return !surecCanli(pid);
}

async function kayitliSaglikli() {
    for (const kayit of kayitAl()) {
        const port = Number(kayit.port);
        const pid = Number(kayit.pid);
        const sahip = portSahibi(port);
        if (sahip.durum !== 'sahipli' || sahip.pid !== pid) continue;
        if (await devtoolsSaglikli(port)) return kayit;
    }
    return null;
}

function elleKaydet(pid, port, c) {
    return kayitEkle({
        pid,
        port,
        uygulama: c.uygulama,
        mod: 'elle',
        basladi: new Date().toISOString()
    });
}

async function elleBul(c) {
    for (let port = c.portAraligi.alt; port <= c.portAraligi.ust; port++) {
        const sahip = portSahibi(port);
        if (sahip.durum !== 'sahipli') continue;
        if (!ayniUygulama(sahip.pid, c.uygulama)) continue;
        if (!(await devtoolsSaglikli(port))) continue;
        return elleKaydet(sahip.pid, port, c);
    }
    return null;
}

function bosPort(c) {
    for (let port = c.portAraligi.alt; port <= c.portAraligi.ust; port++) {
        if (portSahibi(port).durum === 'bos') return port;
    }
    throw new Error('Port araligi dolu: ' + c.portAraligi.alt + '-' + c.portAraligi.ust);
}

async function tarayiciBaslat(c, port) {
    const argumanlar = ['--remote-debugging-port=' + port];
    if (c.mod === 'izole') {
        const profil = path.join(c.profilKok, 'profil-' + port);
        fs.mkdirSync(profil, { recursive: true });
        argumanlar.push('--user-data-dir=' + profil);
    } else if (c.mod === 'harici' && c.profil) {
        argumanlar.push('--user-data-dir=' + c.profil);
    }
    const durum = { cikti: false, hata: null };
    let cocuk;
    try {
        cocuk = spawn(c.uygulama, argumanlar, { detached: true, stdio: 'ignore' });
    } catch (e) {
        throw new Error('Uygulama baslatilamadi: ' + c.uygulama + ' (' + e.message + ')');
    }
    const ciktiMi = () => durum.cikti || cocuk.exitCode !== null || cocuk.signalCode !== null;
    cocuk.on('error', (e) => {
        durum.hata = e;
        durum.cikti = true;
    });
    cocuk.on('exit', () => {
        durum.cikti = true;
    });
    cocuk.unref();
    let hazir = false;
    for (let gecen = 0; gecen < ACILIS_SURE_MS; gecen += ACILIS_ADIM_MS) {
        await uyu(ACILIS_ADIM_MS);
        if (durum.hata) break;
        if (await devtoolsSaglikli(port)) {
            hazir = true;
            break;
        }
        if (ciktiMi()) break;
    }
    if (hazir) {
        return kayitEkle({
            pid: cocuk.pid,
            port,
            uygulama: c.uygulama,
            mod: c.mod,
            basladi: new Date().toISOString()
        });
    }
    if (durum.hata) throw new Error('Uygulama baslatilamadi: ' + c.uygulama + ' (' + durum.hata.code + ')');
    if (!ciktiMi()) {
        grupOldur(cocuk.pid, 'SIGKILL');
        await kapanmaBekle(cocuk.pid, KAPATMA_ZORLA_SURE_MS);
    }
    if (c.mod === 'harici' && !c.profil) throw new Error('Ayni profil tek ornek: yeni ornek icin mod izole veya ayri profil gerekir');
    throw new Error('Tarayici ' + port + ' portunda hazir olmadi');
}

async function tarayiciAc(istenenPort) {
    const c = configAl();
    if (c.mod === 'mevcut') throw new Error('Mod mevcut: tarayici kullanici tarafindan acik olmali');
    if (istenenPort === 0) {
        const mevcut = await kayitliSaglikli();
        if (mevcut) return mevcut;
        const elle = await elleBul(c);
        if (elle) return elle;
    }
    const hedef = istenenPort > 0 ? istenenPort : bosPort(c);
    const sahip = portSahibi(hedef);
    if (sahip.durum !== 'bos') {
        const pid = sahip.pid;
        const kayitli = pid ? kayitAl().find((k) => Number(k.port) === hedef && Number(k.pid) === pid) : undefined;
        if (kayitli && (await devtoolsSaglikli(hedef))) return kayitli;
        if (pid && ayniUygulama(pid, c.uygulama) && (await devtoolsSaglikli(hedef))) return elleKaydet(pid, hedef, c);
        throw new Error('Alan disi PID reddedildi: ' + (pid || 'bilinmiyor') + ', port ' + hedef + '. Dokunulmaz.');
    }
    return tarayiciBaslat(c, hedef);
}

async function tarayiciKapat(pid) {
    const hedefPid = Number(pid);
    const liste = kayitAl();
    const hedef = liste.find((k) => Number(k.pid) === hedefPid);
    if (!hedef) throw new Error('Alan disi PID reddedildi: ' + hedefPid + '. Yalniz bu aracla acilan surecler kapatilabilir.');
    if (hedefPid === process.pid) throw new Error('Kapatma reddedildi: PID ' + hedefPid + ' bu aracin kendi surecidir');
    if (surecCanli(hedefPid)) {
        grupOldur(hedefPid, 'SIGTERM');
        let kapandi = await kapanmaBekle(hedefPid, KAPATMA_SURE_MS);
        if (!kapandi) {
            grupOldur(hedefPid, 'SIGKILL');
            kapandi = await kapanmaBekle(hedefPid, KAPATMA_ZORLA_SURE_MS);
        }
        if (!kapandi) throw new Error('Surec kapatilamadi: PID ' + hedefPid);
    }
    kayitYaz(liste.filter((k) => Number(k.pid) !== hedefPid));
    return { kapatildi: hedefPid };
}

async function tarayiciDurum() {
    return Promise.all(kayitAl().map(async (k) => {
        return {
            pid: k.pid,
            port: k.port,
            mod: k.mod,
            canli: surecCanli(k.pid),
            devtools: await devtoolsSaglikli(k.port)
        };
    }));
}

function sarmala() {
    const sonuc = spawnSync(process.execPath, [path.join(DIZIN, 'sarmala.mjs')], { stdio: 'inherit' });
    if (sonuc.error) throw new Error('Sarmalayici baslatilamadi: ' + sonuc.error.message);
    return sonuc.status === null ? 1 : sonuc.status;
}

function argumanlariCoz() {
    const ham = process.argv.slice(2);
    const komut = ham[0] || '';
    const degerler = { port: 0, pid: null };
    for (let i = 1; i < ham.length; i++) {
        const arg = ham[i];
        let ad = '';
        let metin = '';
        if (arg === '--port' || arg === '--pid') {
            ad = arg.slice(2);
            metin = ham[i + 1] === undefined ? '' : ham[i + 1];
            i++;
        } else if (arg.startsWith('--port=')) {
            ad = 'port';
            metin = arg.slice('--port='.length);
        } else if (arg.startsWith('--pid=')) {
            ad = 'pid';
            metin = arg.slice('--pid='.length);
        } else {
            throw new Error('Bilinmeyen secenek: ' + arg);
        }
        if (!/^\d+$/.test(metin)) throw new Error('Gecersiz --' + ad + ' degeri: ' + metin);
        const sayi = Number(metin);
        const alt = ad === 'port' ? 0 : 1;
        const ust = ad === 'port' ? EN_BUYUK_PORT : Number.MAX_SAFE_INTEGER;
        if (sayi < alt || sayi > ust) throw new Error('Gecersiz --' + ad + ' degeri: ' + metin);
        degerler[ad] = sayi;
    }
    return { komut, port: degerler.port, pid: degerler.pid };
}

function yaz(nesne) {
    process.stdout.write(JSON.stringify(nesne, null, JSON_GIRINTI) + '\n');
}

async function ana() {
    const ayar = argumanlariCoz();
    if (ayar.komut === 'ac') {
        yaz(await tarayiciAc(ayar.port));
        return;
    }
    if (ayar.komut === 'kapat') {
        if (ayar.pid === null) throw new Error('kapat icin --pid gerekli');
        yaz(await tarayiciKapat(ayar.pid));
        return;
    }
    if (ayar.komut === 'durum') {
        yaz(await tarayiciDurum());
        return;
    }
    if (ayar.komut === 'sarmala') {
        process.exit(sarmala());
    }
    throw new Error('Komut gecersiz: ' + (ayar.komut || '(bos)') + '. Kullanim: ac [--port N] | kapat --pid N | durum | sarmala');
}

try {
    await ana();
} catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
}
