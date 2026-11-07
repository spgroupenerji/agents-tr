---
description: "Ajan gömme ve kurulum protokolü: depo bağlantısı verildiğinde anayasayı ve zorunlu araçları platformun global ortamına kuran icra adımları ve kopyala-kullan hazır prompt."
version: "v202611072050"
---

# Ajan Gömme ve Kurulum Protokolü

> Bu dosya bir ajana verilen **icra talimatıdır**. Kullanıcı bu deponun bağlantısını verip "buradakileri yükle" dediğinde ajan bu protokolü uygular.
> Anayasa kaynağı: [AGENTS-tr.md](AGENTS-tr.md) (Türkçe) · Global kurulum kaynağı: [AGENTS-en.md](AGENTS-en.md) (birebir İngilizce çeviri) · Envanter: [01-yuklenecekler/envanter.md](01-yuklenecekler/envanter.md) · Platform matrisi: [platformlar.md](platformlar.md) · Hazır prompt: §9

## 0. Kapsam ve değişmezler

- **Yüklenenler:** `AGENTS-tr.md` anayasasının birebir İngilizce çevirisi olan `AGENTS-en.md` + `01-yuklenecekler/` envanterindeki araçlar.
- **Çeviri eşitliği:** `AGENTS-tr.md` Türkçe kaynaktır, `AGENTS-en.md` onun birebir çevirisidir; iki dosya aynı damgayı ve aynı bölüm/kural numaralarını taşır. Global kural dosyasına İngilizce dosyanın içeriği yazılır.
- **`03-denenecekler/` kapsam dışıdır:** okunmaz, değiştirilmez, yüklenmez. Bu dizin kullanıcının manuel havuzudur; kullanıcı denediği aracı kendisi `01-yuklenecekler/` dizinine taşır ve o an zorunlu yüklenenlere girer.
- **Depo salt kaynaktır:** kurulum sırasında depo dosyaları değiştirilmez; değişiklik depoda yapılıp kurulum yenilenir.
- **Tam otomatik:** onay sorulmaz. Yalnızca platform tespiti belirsizse, yedek alınamıyorsa veya geri dönüşü zor bir çakışma varsa durulur ve raporlanır.
- **İdempotent:** protokol kaç kez çalıştırılırsa çalıştırılsın aynı sonuç üretilir; her çalıştırma yeni bir yedek damgası açar.
- **Varsayım yasağı:** platform, yol, sürüm, komut veya davranış konusunda şüphe varsa ya da bir adım hata verirse, [02-dokumantasyon/linkler.md](02-dokumantasyon/linkler.md) ve [02-dokumantasyon/README.md](02-dokumantasyon/README.md) içindeki resmî belgeden doğrulanır; doğrulanamıyorsa adım atlanır ve rapora yazılır. Tahminle ilerlenmez.
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
2. Her satır için önce **mevcut durumu tespit et**: araç kurulu mu ve sürümü envanterdeki doğrulama ölçütüyle uyumlu mu? Kurulu ve güncel satırı **atla**; kurulu ama eski satırı resmî yöntemle **güncelle**; hiç kurulu olmayan ya da eksik kalan satırı **kur**. Tespit edilen durum Aşama 5 raporuna yazılır.
3. Her satırı türüne göre **kur veya güncelle**:
   - `skill`: depoyu geçici dizine klonla (`git clone --depth 1`), `SKILL.md` ve eşlik eden dosyaları platformun skill dizinine `<ad>/` altına kopyala, geçici dizini sil.
   - `MCP`: platformun MCP yapılandırma dosyasına `{command, args}` girişi ekle; aynı adlı eski girişi ez. Chrome DevTools MCP satırında kullanıcıya sormadan yapılandırma yazma: (1) kullanılacak Chrome yolu, (2) ayrı/izole profil tercihi (Chrome 136+ varsayılan profilde remote debugging'e izin vermez; `--user-data-dir` zorunludur) ve (3) remote debugging portu sorulur; cevap envanterdeki biçime göre uygulanır ve seçilen port `/json/version` ile doğrulanır.
   - `CLI`: envanterdeki kurulum komutunu çalıştır, ardından `command -v` ile doğrula.
   - `kütüphane`, `site`, `veri`: kurulum yok; Aşama 4'e bırak.
4. Envanterde kurulum alanı `doğrulanmalı` olan satırı **kurma**; rapora "atlandı" olarak yaz.
5. Yalnızca resmî dağıtım yöntemini kullan (`npm`, `pipx`, `cargo`, `go install`, `git clone`). Doğrudan indirilmiş betiği icra etme.
6. Bir satırda hata olursa kaydet ve sonraki satıra geç; aynı satırı ikinci kez deneme. Hata listesi Aşama 5 raporuna girer.

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
| Güncellenen satır | mevcut sürümden yükseltilen satır sayısı, liste halinde |
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

## 9. Hazır Prompt (kopyala-kullan)

Kullanıcı bu bölümü olduğu gibi kopyalar, `Depo:` satırındaki bağlantıyı kendi depo bağlantısıyla değiştirir ve ajana verir. Başka düzenleme gerekmez; istem, protokolün tamamını ve doğrulama kurallarını ajana taşır.

```text
Aşağıdaki depoyu, KURULUM.md protokolüne göre global olarak kur:

Depo: https://github.com/spgroupenerji/agents-tr

Kurulum kuralları:
- Depoyu geçici dizine klonla, KURULUM.md'yi birebir uygula; önce platformunu tespit et, platformlar.md matrisini kullan.
- Mevcut durumu tespit et: bu makinede çoğu araç zaten kurulu olabilir. Envanterdeki her satır için önce "kurulu mu, güncel mi" diye bak; kurulu ve güncel olanı atla, eksik kalanı kur, güncel olmayanı resmî yöntemle güncelle.
- Varsayım yapma. Platform, yol, sürüm, komut, API veya davranış konusunda şüpheye düşersen ya da bir adım hata verirse, bu depodaki 02-dokumantasyon/README.md ve 02-dokumantasyon/linkler.md içindeki resmî belgeyi aç, doğrula, sonra devam et. Doğrulayamazsan o adımı atla ve rapora yaz; tahminle ilerleme.
- Mevcut global kural dosyasını yedekle, sonra AGENTS-en.md içeriğini global kural dosyasına sıfırdan yaz.
- 03-denenecekler/ dizinini okuma, değiştirme, kurma.
- Envanterde kurulum alanı "doğrulanmalı" olan satırı kurma; rapora "atlandı" yaz.
- İdempotent çalış: protokol tekrar çalıştırıldığında aynı sonucu üretsin.
- Raporu Türkçe ver: tespit edilen platform, kural dosyası yolu, yedek yolu, kurulan / güncellenen / atlanan / hatalı satır listesi. Rapor secret, token veya kişisel veri içermesin.
```

İstem metni şu davranışları ajana zorunlu kılar: mevcut kurulumu tespit ederek atlama/kurma/güncelleme kararı, varsayım yasağı ve `02-dokumantasyon/` üzerinden doğrulama, yedekleme ve raporlama.
