---
description: "Hafıza politikası: epizodik ve semantik katman ayrımı, kod bağlı karar, tazelik ve çelişki çözümü, saklama ve arşivleme."
version: "v202611140625"
---

# Hafıza Politikası

Kalıcı bilgi tek doğru değildir: her kayıt tarih, kaynak ve varsa kod bağı taşır. Çelişkide sıra **kod > tarihli karar > gözlem**'dir.

## Katmanlar

| Katman | Sahip | İçerik | Tazelik |
| --- | --- | --- | --- |
| Epizodik | claude-mem | Ne konuşuldu, ne yapıldı | TTL ve arşiv; doğru kabul edilmez, bağlamdır |
| Semantik | trace-mcp karar defteri | Karar, gerekçe, geçerlilik | `valid_from`/`valid_until` ve kod bağı |
| Kaynak | kod ve git | Gerçek | Tek doğru |

Kural: aynı konuda iki kayıt varsa en yeni ve kanıtlı olan kazanır; eski kayıt silinmez, `invalidate_decision` ile geçersiz kılınır.

## Kod bağı ve tazelik

1. Karar kaydı `symbol_id` veya `file_path` ile `valid_from` taşır; bağsız karar yazılmaz.
2. Kod değişince `get_change_impact` bağlı kararları yüzeye çıkarır; her karar dosya ve sembol üzerinden doğrulanır.
3. Geçersiz karar `invalidate_decision` ile kapatılır; yerine yeni karar ve yeni `valid_from` yazılır.
4. Gözlem kanıt değildir; bir iddiayı yalnız kod veya karar kaydı kanıtlar.

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

Chroma (yaklaşık 640 MB) DB ile birlikte budanır; gözlem silme yalnız yeniden indeksleme doğrulandıktan sonra çalıştırılır.

## Komutlar

- `node araclar/hafiza-bakim.mjs`: rapor.
- `node araclar/hafiza-bakim.mjs --uygula`: log, yedek ve bekleyen mesaj temizliği.
- `node araclar/hafiza-bakim.mjs --arsivle`: arşiv planı; silme için `--gozlem-sil`.

## Değerlendirilen alternatifler

- **Kage**: kavram doğru (kodla doğrulanan dosya hafızası) ama 41 yıldız, son push 2026-08-29 ve GPL-3.0; şimdilik kullanılmaz.
- **Trail**: `.trail/` öğrenmeleri ve `trail check`; 0.29 öncesi sürüm ve DSH hook'u yok; tek repo pilotu.
