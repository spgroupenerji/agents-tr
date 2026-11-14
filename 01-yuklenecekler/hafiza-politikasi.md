---
description: "Hafıza politikası: epizodik ve semantik katman ayrımı, kod bağlı karar kaydı, tazelik ve çelişki çözümü, saklama ve arşivleme."
version: "v202611140630"
---

# Hafıza Politikası

Kalıcı bilgi tek doğru değildir: her kayıt tarih, kaynak ve varsa kod bağı taşır. Çelişkide sıra **kod > tarihli karar > gözlem**'dir.

## Katmanlar

| Katman | Sahip | İçerik | Tazelik |
| --- | --- | --- | --- |
| Epizodik | claude-mem | Ne konuşuldu, ne yapıldı | TTL ve arşiv; doğru kabul edilmez, bağlamdır |
| Semantik | repo karar kaydı (`docs/kararlar`) | Karar, gerekçe, kod bağı | Tarih, commit ve kod yolu; git ile taşınır |
| Kaynak | kod ve git | Gerçek | Tek doğru |

Aynı konuda iki kayıt varsa en yeni ve kanıtlı olan kazanır; eski kayıt silinmez, `durum: gecersiz` ve `ust` bağıyla kapatılır.

## Karar kaydı

Karar, kodun yanında ve git geçmişinde yaşar: `docs/kararlar/<damga>-<slug>.md`. Her kayıt tarih, durum, tür, kaynak ve kod bağlarını taşır; kod bağı `yol[:satır]@commit` biçimindedir.

- `node araclar/karar.mjs ekle --baslik "..." --karar "..." --kod "yol:satır" --tur mimari`
- `node araclar/karar.mjs liste`
- `node araclar/karar.mjs denetle`: kod yolu silinmiş veya commit yoksa hata; dosya karardan sonra değişmişse uyarı.
- `node araclar/karar.mjs gecersiz <id>`: kaydı kapatır.

Kural: karar kaydı olmadan "böyle karar verilmişti" denmez; gözlem karar yerine geçmez.

## Tazelik

1. Kod değişince `karar.mjs denetle` bağlı kararları uyarı olarak yüzeye çıkarır.
2. Uyarı alan karar gözden geçirilir: hâlâ geçerliyse yeni kod bağıyla güncellenir, değilse `gecersiz` + yeni karar yazılır.
3. Bir iddia yalnız kod veya karar kaydıyla kanıtlanır; gözlem kanıt değildir.

## Saklama

| Veri | Kural |
| --- | --- |
| Gözlem, 0–30 gün | Sıcak; tümü kalır |
| Gözlem, 31–120 gün | `decision`, `bugfix`, `security_*` kalır; `discovery`, `change`, `refactor` arşive |
| Gözlem, 120 gün+ | Arşivlenir, DB'den çıkarılır |
| Üst sınır | 25.000 gözlem; aşılırsa en eski arşivlenir |
| Log | 14 gün |
| Yedek | Son 3 dosya |
| Bekleyen mesaj | 7 gün |

Chroma (yaklaşık 640 MB) DB ile birlikte budanmalıdır; yeniden indeksleme doğrulanmadan gözlem silinmez. Bugünkü veri 30 günden yeni olduğu için silme sırası gelmedi.

## Komutlar

- `node araclar/hafiza-bakim.mjs`: rapor.
- `node araclar/hafiza-bakim.mjs --uygula`: log, yedek ve bekleyen mesaj temizliği.
- `node araclar/hafiza-bakim.mjs --arsivle`: arşiv planı; silme için `--gozlem-sil`.

## Değerlendirilen alternatifler

- **Kage**: kavram doğru (kodla doğrulanan dosya hafızası) ama 41 yıldız, son push 2026-08-29 ve GPL-3.0; kullanılmaz.
- **Trail**: `.trail/` öğrenmeleri ve `trail check`; 0.29 öncesi sürüm ve DSH hook'u yok; tek repo pilotu.
- **trace-mcp karar defteri**: kod bağlı ve geçerlilik alanlı, ama makineye bağlı (`~/.trace`) ve repo ile taşınmaz; yalnız kod grafiği için kullanılır.
