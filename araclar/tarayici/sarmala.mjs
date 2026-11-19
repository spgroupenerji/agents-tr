import { spawn, execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const dizin = fileURLToPath(new URL('.', import.meta.url));
const configYolu = join(homedir(), '.agents', 'tarayici.json');

function hata(mesaj) {
    console.error('Sarmalayici: ' + mesaj);
    process.exit(1);
}

let config;
try {
    config = JSON.parse(readFileSync(configYolu, 'utf8'));
} catch (e) {
    hata('config okunamadi (' + configYolu + '): ' + e.message);
}

const mod = config.mod || 'mevcut';
let port = Number(config.port || 0);

const arac = process.platform === 'win32'
    ? ['powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(dizin, 'tarayici.ps1'), '-Komut', 'ac']]
    : [process.execPath, [join(dizin, 'tarayici.mjs'), 'ac']];

if (mod !== 'mevcut') {
    try {
        const cikti = execFileSync(arac[0], arac[1], { encoding: 'utf8' });
        port = JSON.parse(cikti.trim()).port;
    } catch (e) {
        hata('tarayici acilamadi: ' + (e.stderr || e.message));
    }
} else if (!port) {
    port = 9222;
}

const url = 'http://127.0.0.1:' + port;
const mcpArgs = ['-y', 'chrome-devtools-mcp@latest', '--browserUrl', url];
const komut = process.platform === 'win32' ? 'cmd' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', ...mcpArgs] : mcpArgs;

const cocuk = spawn(komut, args, { stdio: 'inherit' });
cocuk.on('error', (e) => hata('MCP baslatilamadi: ' + e.message));
cocuk.on('exit', (kod) => process.exit(kod === null ? 1 : kod));
