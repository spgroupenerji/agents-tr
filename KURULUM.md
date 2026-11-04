---
description: "Ajan gömme ve kurulum protokolü: depo bağlantısı verildiğinde anayasayı ve zorunlu araçları platformun global ortamına kuran icra adımları."
version: "v202611040437"
---

# Ajan Gömme ve Kurulum Protokolü

> Bu dosya bir ajana verilen **icra talimatıdır**. Kullanıcı bu deponun bağlantısını verip "buradakileri yükle" dediğinde ajan bu protokolü uygular.
> Anayasa kaynağı: [AGENTS-tr.md](AGENTS-tr.md) (Türkçe) · Global kurulum kaynağı: [AGENTS-en.md](AGENTS-en.md) (birebir İngilizce çeviri) · Envanter: [01-yuklenecekler/envanter.md](01-yuklenecekler/envanter.md) · Platform matrisi: [platformlar.md](platformlar.md)

## 0. Kapsam ve değişmezler

- **Yüklenenler:** `AGENTS-tr.md` anayasasının birebir İngilizce çevirisi olan `AGENTS-en.md` + `01-yuklenecekler/` envanterindeki araçlar.
- **Çeviri eşitliği:** `AGENTS-tr.md` Türkçe kaynaktır, `AGENTS-en.md` onun birebir çevirisidir; iki dosya aynı damgayı ve aynı bölüm/kural numaralarını taşır. Global kural dosyasına İngilizce dosyanın içeriği yazılır.
- **`03-denenecekler/` kapsam dışıdır:** okunmaz, değiştirilmez, yüklenmez. Bu dizin kullanıcının manuel havuzudur; kullanıcı denediği aracı kendisi `01-yuklenecekler/` dizinine taşır ve o an zorunlu yüklenenlere girer.
- **Depo salt kaynaktır:** kurulum sırasında depo dosyaları değiştirilmez; değişiklik depoda yapılıp kurulum yenilenir.
- **Tam otomatik:** onay sorulmaz. Yalnızca platform tespiti belirsizse, yedek alınamıyorsa veya geri dönüşü zor bir çakışma varsa durulur ve raporlanır.
- **İdempotent:** protokol kaç kez çalıştırılırsa çalıştırılsın aynı sonuç üretilir; her çalıştırma yeni bir yedek damgası açar.
- **Dil:** rapor ve kurulum günlüğü Türkçe yazılır.

## 1. Aşama 0 — Platform tespiti

1. Ortam işaretlerini topla: `DSH_*` gibi değişkenler, kullanıcı ana dizinindeki platform dizinleri (`.dsh`, `.claude`, `.codex`, `.gemini`, `.agents`, `.cursor`, `.config/opencode`, `.qoder`, `.clinerules`), araç sürüm komutları.
2. [platformlar.md](platformlar.md) tablosundaki **Tespit işareti** sütunuyla eşleştir.
3. Tam olarak bir platform eşleşirse devam et. Eşleşme yoksa veya birden fazlaysa kullanıcıya tek soru sor; cevap yoksa dur ve raporla.
4. Platform matrisindeki hücre "doğrulanmalı" ise ilgili resmî dokümanı ([02-dokumantasyon/linkler.md](02-dokumantasyon/linkler.md)) oku ve yolu teyit et. Teyit edilemezse dur ve raporla.

## 2. Aşama 1 — Yedekleme

1. Hedef global kural dosyası varsa aynı dizine `<ad>.yedek-<damga>` olarak kopyala. Damga: `vYYYYMMDDHHMM`, Türkiye saati (UTC+3), çalıştırma anında tek üretim.
2. Yedek alınamazsa kuruluma devam etme; nedeni raporla.
3. Yedek yolu Aşama 5 raporuna yazılır.

## 3. Aşama 2 — Anayasayı (İngilizce çeviriyi) sıfırdan yaz

1. `AGENTS-en.md` içeriğini oku (Türkçe `AGENTS-tr.md`'nin birebir İngilizce çevirisi).
2. Hedef global kural dosyasını **tamamen yeniden yaz**: eski içerikten hiçbir satır kalmaz; ekleme, çıkarma veya uyarlama yapılmaz, birebir kopyadır; kaynak `AGENTS-en.md` dosyasıdır.
3. Doğrula: `AGENTS-en.md` ile hedef için SHA256 eşit; satır sayısı eşit; hedef dosyada eski sürümden kalan işaret yok.
4. Doğrulama başarısızsa yedeği geri yükle, dur ve raporla.

Kural dosyası yolu platforma göre değişir; [platformlar.md](platformlar.md) **Global kural dosyası** sütunundaki yolu kullan.

## 4. Aşama 3 — Yetenek kurulumu

1. [01-yuklenecekler/envanter.md](01-yuklenecekler/envanter.md) dosyasını oku.
2. Her satırı türüne göre kur:
   - `skill`: depoyu geçici dizine klonla (`git clone --depth 1`), `SKILL.md` ve eşlik eden dosyaları platformun skill dizinine `<ad>/` altına kopyala, geçici dizini sil.
   - `MCP`: platformun MCP yapılandırma dosyasına `{command, args}` girişi ekle; aynı adlı eski girişi ez.
   - `CLI`: envanterdeki kurulum komutunu çalıştır, ardından `command -v` ile doğrula.
   - `kütüphane`, `site`, `veri`: kurulum yok; Aşama 4'e bırak.
3. Envanterde kurulum alanı `doğrulanmalı` olan satırı **kurma**; rapora "atlandı" olarak yaz.
4. Yalnızca resmî dağıtım yöntemini kullan (`npm`, `pipx`, `cargo`, `go install`, `git clone`). Doğrudan indirilmiş betiği icra etme.
5. Bir satırda hata olursa kaydet ve sonraki satıra geç; aynı satırı ikinci kez deneme. Hata listesi Aşama 5 raporuna girer.

## 5. Aşama 4 — Kaynak indeksi

1. `kütüphane`, `site` ve `veri` türündeki bağlantıları platformun global referans biçimine yaz.
2. Hedef biçim [platformlar.md](platformlar.md) **Kaynak indeksi hedefi** sütununda tanımlıdır:
   - `agents-tr-kaynaklar` skill'i: `SKILL.md` içinde tür gruplu bağlantı listesi.
   - Kural dizinindeki `agents-tr-kaynaklar.md` dosyası: aynı içerik, düz Markdown.
3. İndeks her çalıştırmada baştan yazılır; eski indeksten kalıntı bırakılmaz.
4. Bağlantı sayısı envanterdeki kaynak satırı sayısıyla eşit olmalıdır; eksik varsa rapora yaz.

## 6. Aşama 5 — Doğrulama ve rapor

Aşağıdakileri ölç ve sonucu kullanıcıya düz metin olarak ver:

| Ölçüt | Beklenen |
| --- | --- |
| Global kural dosyası SHA256 | `AGENTS-en.md` ile eşit |
| Çeviri eşitliği | `AGENTS-tr.md` ↔ `AGENTS-en.md` damga, bölüm ve kural numaraları eşit |
| Kural dosyasında eski kalıntı | yok |
| Kurulan skill sayısı | envanterdeki skill satırı − atlanan |
| MCP girişleri | envanterdeki MCP satırıyla eşleşir |
| Kaynak indeksi satırı | envanterdeki kaynak satırıyla eşit |
| Yedek dosyası | var ve yolu raporlandı |
| Atlanan / hatalı satır | liste halinde |

Rapor; platform adı, kural dosyası yolu, yedek yolu, kurulan/atlanan/hatalı sayıları ve yeniden çalıştırma komutunu içerir. Rapor hassas veri (token, şifre, kişisel veri) taşımaz.

## 7. Yeniden çalıştırma ve geri alma

- **Yeniden çalıştırma:** protokol baştan uygulanır; her çalıştırma yeni bir yedek damgası üretir, eski yedekler silinmez.
- **Geri alma:** en son yedek dosyayı hedefin üzerine kopyala; envanterdeki adlarla kurulmuş skill dizinlerini ve MCP girişlerini sil. Geri alma sonrası Aşama 5 doğrulamasını tekrar çalıştır.

## 8. Güvenlik sınırları

- Protokol hiçbir adımda secret, token veya kişisel veri okumaz, yazmaz, raporlamaz.
- Üçüncü taraf depolar yalnız resmî paket yöneticisi veya `git clone` ile alınır; indirilen betik doğrudan çalıştırılmaz.
- Kurulum çıktısındaki ham araç logları kullanıcıya aktarılmaz; yalnızca özet rapor verilir.
