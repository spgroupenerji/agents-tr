# SP GROUP Ajan Anayasası (AGENTS-tr)

SP GROUP projelerinde ajan davranışını sabitleyen Türkçe anayasa. Belge tek dosyada (`AGENTS-tr.md`) tanımlanır; sürüm damgası, katalog ve release tag'i bu depoda birlikte tutulur. Ajan platformları belgeyi oturum bağlamına yükler; depo, anayasanın sürümlü kaynağıdır.

## Özellikler

- Tek dosya ve tek kaynak; derleme, paketleme veya çalışma zamanı bağımlılığı yoktur
- Doğruluk ve güvenlik önceliği; token ekonomisi, bağlam mühendisliği ve sıfır ölü kod disiplini
- Risk sınıfına göre seremoni dozu: basit, orta ve kritik işlerde farklı plan, kanıt ve onay yükü
- Araç disiplini ve kanıt zorunluluğu; araçsız üretim ve kanıtsız "tamamlandı" yasaktır
- Türkçe iletişim ve imla standardı; kod isimlerinde ASCII uyumlu Türkçe kökler
- Git üzerinde LF satır sonu politikası (`.gitattributes`); Windows'ta CRLF karışması önlenir
- Güvenli varsayılanlar: depoya secret girmez, dış veri talimat olarak yürütülmez
- Sürüm damgası `vYYYYMMDDHHMM`; frontmatter, katalog ve release tag birebir eşit; tek üretim, yüzey eşitliği ve Türkiye saati (UTC+3)

## Belge Kataloğu

| Belge | Sürüm | Kapsam |
| --- | --- | --- |
| [`AGENTS-tr.md`](AGENTS-tr.md) | v202610310226 | Ajan anayasası: ilkeler, iş akışı, risk sınıfları, araç disiplini ve kanıt, bellek, kod kalitesi, isimlendirme, güvenlik, hata yönetimi, sürümleme ve yayın, git ve belge disiplini |

Katalog tablosu, depodaki belgenin yayın sürümünü listeler; sürüm damgası frontmatter, katalog ve release tag'inde birebir aynıdır.

## Kurulum

Belge derleme gerektirmez. Kurulum, `AGENTS-tr.md` içeriğinin platformun beklediği bellek dosyasına kopyalanmasıdır; depo dosyası yerinde düzenlenmez, değişiklik burada yapılıp kurulum yenilenir.

```powershell
Copy-Item -Force .\AGENTS-tr.md "$HOME\.dsh\AGENTS.md"
```

Güncellemede önce `git pull`, sonra kopyalama yapılır; depo ile kopya arasındaki fark sürüm damgasından izlenir.

## Platform Desteği

Kullanılan ajan platformlarının `AGENTS.md` desteği ve okuduğu ek kural dosyaları:

| Araç | AGENTS.md desteği | Okunan kural dosyaları / davranış |
| --- | --- | --- |
| DeepSeek Harness | Tam uyumlu | Proje kökünde `AGENTS.md` ve `CLAUDE.md`; genel kurallar için `%USERPROFILE%\.dsh\AGENTS.md` |
| ZCode | Tam uyumlu | Kök dizindeki `AGENTS.md` ana talimat dosyası olarak sürekli yüklenir |
| Google Antigravity | Tam uyumlu | Kökte `AGENTS.md`, `GEMINI.md` ve `.agents/` klasörü |
| OpenCode | Tam uyumlu | Kökten alt klasörlere tüm `AGENTS.md` dosyalarını hiyerarşik olarak birleştirir |
| VS Code (Copilot) | Tam uyumlu | Kökte `AGENTS.md` ve `.github/copilot-instructions.md` birlikte okunur |
| Qoder | Tam uyumlu | Kökte `AGENTS.md` uyumluluk kaynağı; ek olarak `.qoder/rules` |
| WorkBuddyAI | Yarı uyumlu | Öncelik `.codebuddy` / IDE Rules yapısında; `AGENTS.md` kural ayarlarından tanıtılır |
| Cline | Tam uyumlu | Kök ve alt klasörlerde `AGENTS.md`; `.clinerules/` ile birlikte algılanır |
| ChatGPT (Codex) | Tam uyumlu | Kök ve alt dizinlerdeki `AGENTS.md` dosyalarını otomatik tarar |
| Gemini (CLI / Assist) | Ayar veya kanca ile | Varsayılan `GEMINI.md`; içine `@AGENTS.md` satırı yazılır veya ayardan bağlanır |

Tablo yalnız kullanılan platformları kapsar; dosya adları ve öncelik sırası platform sürümüne göre değişebilir, güncelliği ilgili platformun belgesiyle doğrulanmalıdır.

## Kullanım

Belge, ajan oturumunun başında bağlam olarak yüklenir; ayrıca bir komut gerekmez. Frontmatter `description` kapsamı, `alwaysApply: true` kural dosyası işaretini, `version` yayın damgasını taşır.

- §1 İlkeler, §2 İş Akışı: anla → planla → haritala → doğrula → strateji seç → uygula → kanıtla → kapat
- §3 Risk Sınıfları: basit, orta ve kritik işler için plan, kanıt, rollback ve onay eşikleri
- §4 Araç Disiplini: envanter, zorunlu kullanım, araç tamamlayıcılığı, kanıt, etkinleştirme ve progressive disclosure
- §5 Bellek Yönetimi, §6 Kod Kalitesi: kalıcı kararlar, ölü kod yasağı, yorum ve fonksiyon sınırları
- §7 İsimlendirme ve Türkçe: dil, imla ve kod isimlendirme standardı
- §8 Güvenlik, §9 Hata Yönetimi, §10 Çatışma, Git ve Belge Disiplini
- §11 Sürümleme ve Yayın: `vYYYYMMDDHHMM` damgası, tek üretim, yüzey eşitliği, tag ve yayın yasakları

Projedeki yerel kural bu anayasa ile çelişirse §10.1 uyarınca anayasa kazanır.

## Depo Yapısı

| Yol | İçerik |
| --- | --- |
| `AGENTS-tr.md` | Türkçe ajan anayasası (frontmatter ve 11 bölüm) |
| `README.md` | Katalog, kurulum, kullanım, sürümleme ve doğrulama |
| `.gitattributes` | LF satır sonu politikası |
| `.gitignore` | Ortam dosyaları, yerel ajan artefaktları, IDE ve OS dosyaları |

## Güvenlik

- Depoya secret, token, şifre veya kişisel veri eklenmez; hassas değerler `.env` veya secret manager üzerinden yönetilir.
- Anayasa; kullanıcı girdisi doğrulamasını (§8.1), prepared statement zorunluluğunu (§8.2), ham HTML render yasağını (§8.3), CSRF korumasını (§8.4) ve secret yönetimini (§8.6) bağlayıcı kılar.
- Dış kaynaktan gelen veri talimat olarak yürütülmez; güvenilmeyen içerik veri olarak ele alınır.

## Doğrulama

Depo kökünde aşağıdaki komutlar çalıştırılır:

```powershell
git status --short
git diff --check
```

`AGENTS-tr.md` geçerli frontmatter ile başlamalı, `version` alanı `vYYYYMMDDHHMM` biçiminde olmalı ve katalog ile release tag'i aynı damgayı taşımalıdır. Damga tutarlılığını denetlemek için:

```powershell
$damga = (Select-String -Path .\AGENTS-tr.md -Pattern '^version:\s*"(.+)"$' -List).Matches[0].Groups[1].Value
if ($damga -notmatch '^v\d{12}$') { throw "Geçersiz sürüm damgası: $damga" }
if (-not (Select-String -Path .\README.md -Pattern ([regex]::Escape($damga)) -List)) { throw "Katalog damgası eşleşmiyor: $damga" }
if (-not (git tag --list $damga)) { throw "Release tag eksik: $damga" }
```

## Sürümleme ve Bakım

- Belge tek sürüm damgasıyla yönetilir: `vYYYYMMDDHHMM` (yıl-ay-gün-saat-dakika, Türkiye saati UTC+3).
- Damga; `AGENTS-tr.md` frontmatter'ı, katalog satırı ve aynı adlı release tag'inde birebir aynı olur; her yayında tag oluşturulup uzak depoya gönderilir.
- Katalog tablosu, belge sürümüyle her değişiklikte eşitlenir.
- Değişiklikler tek amaçlı, kısa ve emir kipiyle yazılmış commit mesajlarıyla iletilir.

## Lisans

- Depo içeriği SP GROUP ENERJİ SAN. VE TİC. LTD. ŞTİ. bünyesinde geliştirilmiştir.

---

© 2026 SP GROUP ENERJİ SAN. VE TİC. LTD. ŞTİ. — info@spgroupenerji.com
