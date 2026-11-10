---
description: "Henüz denenmemiş araç, servis ve kaynak listeleri."
version: "v202611100440"
---

# Denemediklerim

> Sade bağlantı listesi: [linkler.md](linkler.md)

## 1. Ajan Altyapısı, Model ve Bağlam Yönetimi

- https://github.com/headroomlabs-ai/headroom - Araç çıktısı, log ve RAG parçalarını LLM'e ulaşmadan sıkıştırır; kütüphane, proxy ve MCP sunucusu olarak çalışır (henüz denenmedi).
- https://github.com/tashfeenahmed/freellmapi - 34 ücretsiz LLM sağlayıcısını tek `/v1` uç noktasında toplayan geçit; akıllı yönlendirme, otomatik yedekleme ve şifreli anahtar saklama sunar.
- https://github.com/decolua/9router - Claude Code, Codex, Cursor, Cline gibi araçları 40+ ücretsiz sağlayıcıya bağlayan yönlendirici; otomatik yedekleme ve token tasarrufu.
- https://github.com/HKUDS/CLI-Anything - Grafik arayüzlü yazılımların kodunu analiz edip ajanların doğrudan kullanabileceği CLI araçlarına dönüştürür.
- https://github.com/vercel-labs/agent-desktop - Ajanlara ekran görüntüsü ve piksel eşleme olmadan bilgisayar kullanımı veren CLI ve C kütüphanesi: masaüstü uygulamasının erişilebilirlik ağacını referanslı JSON olarak okur, ajandaki döngü tıklama/yazmayı bu referanslarla yürütür; macOS, Windows ve Linux (Apache-2.0, Vercel Labs).
- https://github.com/microsoft/TokenEconomizer - Kodlama ajanlarının maliyetini deneyimden öğrenerek düşüren eklenti: mikro-beceriler, kullanılmayan araçları budama ve hata döngüsü müdahalesi; Claude Code, Codex, Copilot CLI, Pi ile deneysel opencode/Cursor/Grok/Hermes/Antigravity destekler; DSH ve ZCode desteklenmediği, Antigravity desteği yalnız deneysel/sınırlı olduğu için aday havuzda (Apache-2.0, Microsoft Research); denenirse Trail-Code MCP'sini kapatmamak için `te config set toolprune=propose --global`.
- https://github.com/nikolai-vysotskyi/trace-mcp - Framework'e duyarlı kod zekâsı MCP sunucusu: 91 framework entegrasyonu ve 81 dili kod grafiğine çıkarır; PR incelemesinde girdi token'ını %72,7 azaltırken anlama paritesi sunduğunu iddia eder (MIT, TypeScript; üretici iddiası).
- https://github.com/redhat-et/ripwire - Kodlama ajanları için sıfır bağımlılıklı C++23 CLI ve MCP sunucusu: depoyu okumadan arama, blast radius, çalıştırılacak testler ve kalite farkı çıkarımı; imzalar gövdeden %74,7 daha az bayt (Apache-2.0; üretici iddiası).
- https://github.com/oraios/serena - Ajanı IDE'ye çeviren kodlama MCP araç seti: dil sunucuları üzerinden anlamsal arama, sembol düzeyinde okuma ve düzenleme yetenekleri (Python; lisans doğrulanmalı).
- https://github.com/DeusData/codebase-memory-mcp - Geliştiriciler ve ajanlar için yerel kod zekâsı: kodu, dokümanları ve altyapıyı kalıcı bir grafikte birleştirir; CBM Lens, MCP araçları, ajan entegrasyonları ve değişime duyarlı test seçimi sunar (MIT).

## 2. Beceri, Prompt ve Hazır Araç Depoları

- https://prompt-motion.com - Claude Opus 5.5 ile üretilmiş motion videolarının prompt ve becerilerini kategorilere ayıran koleksiyon sitesi (ürün arayüzü, kinetik tipografi, partikül, grafik, müzik vb.).
- https://smokich.gosem.dev/stil/ - Claude ile video stilleri: 11 hazır stil (kâğıt poster, kesik kâğıt, konstrüktivist, bilim atlası, risograf, izometrik çizim, düz vektör, kinetik tipografi, sıvı cam, ASCII atlas, parçacık) arasından seçim yapıp konu, biçim, storyboard, ses ve efekt ayarlarıyla Claude Code'a yapıştırılacak İngilizce üretim istemini oluşturan Türkçe koleksiyon sitesi.
- https://github.com/nidhinjs/prompt-master - Claude için prompt yazma becerisi: her yapay zekâ aracına doğru istemi kurar, bağlam ve hafızayı korur.
- https://github.com/f/prompts.chat - Topluluktan prompt paylaşma ve toplama arşivi; kurum içinde kendi sunucunuzda barındırma seçeneği de var.
- https://github.com/omergocmen/aislopmeter - Bir web sitesindeki jenerik yapay zekâ içeriğini puanlayıp adım adım düzelten MCP sunucusu ve CLI; Türkçe destekli.
- https://github.com/kaankiziltug/logo-design-skill - Claude, Gemini CLI, Codex gibi ajanlara logo tasarım disiplini kazandıran beceri; 1.400'den fazla logo referansı, SVG üretimi ve test araçları içerir.
- https://github.com/multica-ai/andrej-karpathy-skills - Karpathy'nin LLM kodlama tuzakları gözlemlerinden türetilmiş tek `CLAUDE.md` dosyası; Claude Code davranışını düzeltir.
- https://github.com/Mahanaicoach/google-maps-scraper-kit - Yerel Docker'da çalışan ücretsiz Google Maps kazıyıcı; telefon, e-posta, web sitesi ve sosyal hesapları CSV'ye aktarır, Claude Code becerisi içerir.
- https://github.com/vercel-labs/skills - Ajan becerileri ekosisteminin resmî CLI'ı (`npx skills`); 80'den fazla ajanın beceri dizinine kurulum, güncelleme, listeleme ve kaldırma yapar, skills.sh dizininden arama sunar.
- https://github.com/mattpocock/skills - Matt Pocock'un günlük mühendislik akışından derlediği 38 becerilik koleksiyon; grill ve grilling ile gereksinim netleştirme, alan sözlüğü, TDD, kod incelemesi, triage ve spec/bilet akışlarını kapsar.
- https://github.com/affaan-m/ecc - Ajan çatısı işletim sistemi: 71 ajan, 314 beceri, hook, kural, hafıza ve AgentShield güvenlik taramasını Claude Code, Codex, OpenCode, Cursor ve Gemini için tek çatıda toplar; `ecc@ecc` eklentisi veya `ecc-universal` npm paketiyle kurulur (henüz denenmedi).
- https://github.com/promptfoo/promptfoo - LLM istemlerini, ajanları ve RAG'leri test eden; kırmızı takım/sızma testi taraması ve model karşılaştırması yapan açık kaynak CLI; bildirimsel YAML yapılandırması ve CI/CD entegrasyonu sunar (henüz denenmedi).

## 3. Katalog ve Liste Kaynakları

- https://github.com/public-apis/public-apis - Kategori kategori ücretsiz API'lerin ortak listesi; yeni bir servis ararken ilk bakılacak yer.
- https://github.com/sindresorhus/awesome - Hemen her konuda "en iyiler" listelerinin dizini; alt listelere açılan ana kapı.
- https://github.com/morluto/awesome-reverse-engineering - İkili dosya, uygulama, firmware, dosya formatı ve protokol çözümleme araçlarıyla öğrenme kaynaklarının seçilmiş listesi.

## 4. Hazır Uygulama ve Servisler

- https://github.com/OpenCut-app/OpenCut - CapCut'a açık kaynak alternatif olarak konumlanan video düzenleyici.
- https://gitdiagram.com/ - Bir GitHub deposunu etkileşimli mimari çizime ya da kısa anlatım videosuna çeviren site.
- https://whatships.com/ - X'te paylaşılan 2.000'den fazla startup lansman videosunu orijinal gönderilere bağlayarak listeleyen dizin.
- https://mcp.orphex.co/?utm_source=orphex.co&utm_medium=referral - Dijital pazarlama bütçe ve teklif yönetimini Claude, ChatGPT ve Copilot üzerinden otomatikleştiren MCP servisi.
- https://github.com/MG1937/ASC - R8 derleyici optimizasyonunu decompiler ilkesi olarak kullanan hızlı ve hafif Android APK çözücü; ajanlar ve mobil araştırmacılar için tasarlandı, Rust sürümü (rust_ASC) 16 iş parçacığıyla 383 MB'lık APK'yı 4 saniyede açıyor (üretici iddiası).
- https://github.com/sherlock-project/sherlock - Bir kullanıcı adını 400+ sosyal ağda arayarak hesap izi çıkaran Python OSINT/CTI CLI'ı; Docker, pipx/pip veya uv ile kurulur, bulunan hesapları dosyaya yazar (MIT).

## 5. Ön Yüz, Tasarım ve Performans Araçları

- https://lenis.dev/ - Hafif ve performanslı yumuşak kaydırma kütüphanesi; JavaScript, React ve Vue ile yatay kaydırma, sonsuz kaydırma ve scroll snapping destekler.
- https://spline.design/ - Tarayıcıda çalışan ücretsiz 3B tasarım aracı; ekip ve ajanlar aynı sahnede modelleme, animasyon ve etkileşimli 3B çıktı üretir.
- https://pagespeed.web.dev/ - Google PageSpeed Insights: sayfa hızı ve Core Web Vitals ölçümü; laboratuvar ve gerçek kullanıcı verisini birlikte verir.
- https://svgl.app/ - Popüler marka ve teknolojilerin logolarını SVG olarak arayıp kopyalamayı sağlayan logo kütüphanesi; açık ve koyu tema sürümleri vardır.
