---
description: "Zorunlu yüklenen araç kataloğu: her zaman kurulan araçlar ve bölüm bölüm başvuru kaynakları."
version: "v202611140549"
---

# Ajan Araçları Kataloğu

> Kaynak: kullanıcı notları ve resmî depo/sayfa açıklamaları
> Sade bağlantı listesi: [linkler.md](linkler.md)

## 0. Benim İçin Kritik

Bu dördü, ajan oturumlarında en sık başvurduğum temel araçlar; diğer bölümlerde tekrar edilmez.

- https://github.com/obra/superpowers - Ajanı hemen koda daldırmayıp beyin fırtınası, şartname, planlama ve TDD adımlarından geçiren metodoloji çerçevesi.
- https://github.com/spgroupenerji/skills - SP GROUP ajan yeteneklerinin deposu; yetenek kataloğu depodaki `README.md` dosyasındadır.
- https://github.com/upstash/context7 - Kütüphane ve framework dokümantasyonunu sürüm bazlı MCP üzerinden vererek uydurma API kullanımını engelleyen platform.
- https://github.com/ChromeDevTools/chrome-devtools-mcp - Ajanların Chrome'u MCP üzerinden kontrol etmesini, DOM ve ağ trafiğini denetlemesini sağlayan resmî Chrome DevTools aracı. Kurulumda ajan kullanıcıya kullanılacak Chrome yolunu, ayrı/izole profil kullanıp kullanmayacağını ve remote debugging portunu sorar; güncel Chrome sürümleri (136+) varsayılan profilde remote debugging'e izin vermediği için ayrı profil önerilir.

## 1. Metodoloji ve Süreç

Yeni bir işe başlarken, kodu sadeleştirirken veya bir isteği derinleştirirken buraya bak.

- https://github.com/DietrichGebert/ponytail - Ajanı "odadaki en tembel kıdemli geliştirici" gibi düşündürerek üçüncü parti paket ve aşırı mühendislik yerine en küçük çözümü seçtiren YAGNI becerisi.
- https://github.com/tt-a1i/simplify-codebase - Kod tabanındaki gereksiz soyutlama ve karmaşıklığı davranışı bozmadan kanıtlayıp temizleyen analiz becerisi.
- https://github.com/DannyMac180/skills/tree/main/be-ambitious - Bir görevi büyütmeden derinleştiren prompt yeniden yazıcı: uzmanın sormadığın ham maddeyi, yöntemi ve dış doğrulama ölçütünü çıkarır.

## 2. Kod Zekâsı ve Etki Analizi

Bir sembolü değiştirmeden önce bağımlılıkları, çağrı yollarını ve etki alanını çıkarmak için buraya bak.

- https://github.com/redhat-et/ripwire - Kodlama ajanları için sıfır bağımlılıklı C++23 CLI: depoyu okumadan `--for` ile doğru dosyaları bulur, blast radius ve çalıştırılacak testleri çıkarır, `--edit-check`/`--quality-delta`/`--test-gate` ile kalite kapısı kurar; MCP sunucusu opsiyoneldir (Apache-2.0).
- https://github.com/oraios/serena - Dil sunucuları (LSP) üzerinden anlamsal arama, sembol düzeyinde okuma, düzenleme ve refactor yapan MCP araç seti; 40+ dil (PHP, Python, Rust, TypeScript, JavaScript, CSS/SCSS, Vue, Svelte dahil) destekler (GPL-3.0 çekirdek, SolidLSP MIT).
- https://github.com/nikolai-vysotskyi/trace-mcp - Framework'e duyarlı kod zekâsı MCP sunucusu: 91 framework entegrasyonu ve 81 dili kod grafiğine çıkarır; PHP↔React/Vue, route ve ORM gibi çapraz dil kenarlarını bilir; PR incelemesinde girdi token'ını %72,7 azalttığını iddia eder (MIT; üretici iddiası).

## 3. Dokümantasyon, Sıkıştırma ve Hafıza

Büyük araç çıktısını küçültürken, belgeyi okunabilir hâle getirirken veya oturumlar arası bağlam taşırken buraya bak; güncel kütüphane dokümantasyonunun kendisi için 0. bölümdeki Context7.

- https://github.com/mksglu/context-mode - Araç çıktısını sandbox'ta filtreleyip bağlamı hafifleten, MCP ve hook'larla platformlar arası yönlendirme yapan bağlam sıkıştırma katmanı (üretici iddiası: %98'e varan azaltma).
- https://github.com/microsoft/markitdown - Dosya ve ofis belgelerini Markdown'a çevirerek okuma token maliyetini düşüren resmî Microsoft aracı.
- https://github.com/thedotmack/claude-mem - Oturum gözlemlerini yakalayıp semantik olarak sıkıştıran ve ilgili bağlamı sonraki oturumlara enjekte eden kalıcı hafıza sistemi.

## 4. Arayüz ve Tasarım

Web arayüzü üretirken estetik kararlar, tasarım sistemi veya canvas efektleri gerektiğinde buraya bak; tarayıcı otomasyonu ve DOM denetimi için 0. bölümdeki Chrome DevTools MCP.

- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill - 79 aranabilir arayüz stili, renk paleti ve tipografi kuralıyla ajanın profesyonel tasarım sistemleri üretmesini sağlayan beceri.
- https://github.com/pbakaus/impeccable - Ajanın ürettiği jenerik "AI slop" tasarımı 62 deterministik dedektör kuralıyla yakalayan, tarayıcıda canlı yineleme yaptıran tasarım kılavuzu.
- https://github.com/VoltAgent/awesome-design-md - Apple, Stripe gibi markaların tasarım dillerini `DESIGN.md` olarak toplayan arşiv; projeye bırakıldığında ajan o standartta arayüz üretir.
- https://github.com/DavidHDev/canvas-ui - Canlı DOM'u canvas dokusuna çevirip akışkan simülasyon, gölgelendirici ve cam/kırılma efektleri uygulayan 35 bileşenlik WebGL/WebGPU kütüphanesi.
- https://github.com/Leonxlnx/taste-skill - Kodlama ajanına sanat yönetimi, referans görsel ve tarayıcı kontrolü kazandırarak jenerik AI sayfası yerine özgün arayüz ürettiren beceri.
- https://github.com/emilkowalski/skills - Vercel ve Linear deneyimine dayanan tasarım ve animasyon becerileri; easing, gölge ve native his kararlarını iyileştirir.
- https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md - Claude Code'un resmî `frontend-design` becerisi: arayüz tasarımı kuralları ve estetik kararlar (bağlantı 2026-10-28 itibarıyla 404 döndü; beceri `anthropics/skills` deposuna taşınmış görünüyor — doğrulanmalı).
- https://github.com/meticsmedia/10k-websites - ChatGPT/Codex için uçtan uca web sitesi becerisi: kaydırmayla oynayan açılış filmi, OpenArt ile görsel/video üretimi ve Hostinger'a tek adımda yayın.
- https://github.com/nutlope/hallmark - Together AI'nin tasarım becerisi: 50 temalı malzeme kataloğundan üç tema seçip sayfayı ziyaretçinin işine göre kurar, sonucu gerçek tarayıcıda makine üretimi izlerine karşı lint eder.
- https://github.com/meodai/skill.color-expert - Renk bilimi için ajan becerisi: renk uzayları, APCA/WCAG erişilebilirliği, palet üretimi, pigment karışımı ve tarihsel renk kuramını kapsayan 180'den fazla referans dosyası; Claude Code, Codex, Cursor ve Copilot ile çalışır.
- https://github.com/borghei/Claude-Skills/blob/main/engineering/design-auditor/SKILL.md - Arayüz tasarımını 12 kategoride puanlayan, yapay zekâ slop kalıplarını ve WCAG renk uyumunu yakalayan, tasarım token'ı uyumunu ölçen ajan becerisi; borghei/Claude-Skills deposundaki 383 beceriden biri.
- https://github.com/heydamir/unslop - Vibecoded/yapay zekâ görünümlü arayüzü slop bulgularından tasarıma çeviren Claude Code/Codex becerisi (Damir Sokolovsky, CC BY 4.0): boşluk, renk, ikon, metin, tipografi, yerleşim, detay, görsel ve hareketi sırayla düzeltir; canlı site görüntüsü ve story videosu için Playwright + Chromium, video için ffmpeg ister.
- https://github.com/meta/astryx - Meta'nın açık kaynak tasarım sistemi: React 19 + StyleX üzerinde 150+ erişilebilir bileşen, tema paketleri ve `astryx` CLI'ı; CLI bileşen dokümanı, şablon, token ve codemod işlerini insan ve ajanın aynı JSON API'den kullanmasını sağlar (MIT, beta).
- https://github.com/GoogleChrome/modern-web-guidance - Google Chrome, Microsoft Edge, Mozilla Firefox ve MDN ekiplerinin birlikte yürüttüğü, güncel web platformu uzmanlığını ve Baseline uyumluluk verisini kodlama ajanına taşıyan beceri takımı: `modern-web-guidance` becerisi HTML/CSS/istemci JavaScript işlerinde yerel ve çevrimdışı CLI (`search`, `retrieve`, `legacy-scan`) üzerinden 209 Markdown kılavuzdan ilgiliyi bağlama getirir, `chrome-extensions` becerisi Manifest V3 uzantı üretimini kapsar; Claude Code, Codex, Cursor ve Gemini eklentileri ile `npx skills add` üzerinden kurulur (Apache-2.0).

## 5. İnceleme, Güvenlik ve Tersine Mühendislik

Kod incelemesi, güvenlik testi veya ikili/uygulama çözümlemesi gerektiğinde buraya bak.

- https://github.com/alibaba/open-code-review - Deterministik kurallar ile LLM ajanını birleştirerek satır bazlı hata ve güvenlik açığı (NPE, thread-safety, XSS, SQL injection) tespit eden inceleme aracı.
- https://github.com/morluto/rea - İkili dosya, uygulama ve çalışma zamanı davranışını yerelde analiz eden, Ghidra/JADX/apktool/binwalk gibi araçları tek MCP altında toplayan tersine mühendislik sunucusu.
- https://github.com/aicodeking/leanrea - REA'nın MCP katmanını atıp 8 KB'lık tek `SKILL.md` ile ajana hedef türüne göre en hızlı komutu (otool, jadx, binwalk vb.) seçtiren alternatif.
- https://github.com/usestrix/strix - Açık kaynak yapay zekâ sızma testi aracı; uygulamanın açıklarını bulup düzeltmeye yardım eder. Ajan becerisi paketi: depodaki `skills/` altındaki 9 beceri (api-security-testing, application-security-testing, ci-security-scanning-with-strix, find-security-vulnerabilities-in-code, fix-security-vulnerabilities-with-strix, managed-pentesting-with-strix, owasp-top-10-testing, penetration-testing-with-strix, web-app-penetration-testing) ajan skill dizinine kopyalanır.
- https://github.com/Jakeschincariol/replica-skill - Herhangi bir uygulamayı tersine mühendislikle klonlayıp yeniden kuran, hatalarını ayıklayan on bir ücretsiz Claude becerisi.
- https://github.com/BehiSecc/VibeSec-Skill - Web uygulamalarında güvenli kod yazımı için "bug hunter" bakışı kazandıran beceri: erişim kontrolü ve IDOR, XSS, CSRF, istemci tarafı secret sızıntısı, açık yönlendirme, SSRF, güvensiz dosya yükleme, SQL enjeksiyonu, XXE, yol geçişi ve JWT güvenliğini atlatma teknikleriyle birlikte kapsar; Apache-2.0 lisanslı tek `SKILL.md` dosyası.

## 6. Video ve Hareketli Grafik

Kodla video üretirken üç katman: ajan becerisi (6.1), altta çalışan motor (6.2), uçtan uca hat veya örnek koleksiyonu (6.3).

### 6.1 Ajan Yetenekleri

- https://github.com/nateherkai/herk-edit-kit - Codex veya Claude Code ile video, Reels ve YouTube Shorts kurgusu; HyperFrames + GSAP tabanlı, 15 beceri ve 406 motion-graphics kartı.
- https://github.com/eyaprak/skills/tree/main/hyperframes-studio - HyperFrames ile 16:9 açılış hook'u, 9:16 Shorts veya animasyonlu slidedeck üreten hepsi bir arada studio; koyu tema, tek marka rengi ve self-hosted Manrope + JetBrains Mono fontlarla oynatılabilir kompozisyon çıkarır.
- https://github.com/omergocmen/anything2explainer - Herhangi bir konuyu seslendirmeli, altyazılı ve bölüm çubuklu kara tuval animasyon anlatım videosuna çeviren Claude Code/Codex becerisi.
- https://github.com/cth9191/animate - Her stilde (piksel sanatı, kesme kâğıt vb.) prosedürel animasyon: hikâye, görsel ve storyboard kontrolleri içeren tek dosya canvas videoları.
- https://github.com/greensock/gsap-skills - GSAP'in resmî AI becerileri; zaman çizelgesi ve animasyonu doğru API ile kullandırır.
- https://github.com/LottieFiles/motion-design-skill - Zamanlama, easing, koreografi ve Disney'in 12 animasyon prensibini ajanlara aktaran evrensel prensip deposu.
- https://github.com/leodavincs/kalem - Claude Code ile kodla video üretme becerisi: videoyu 4-8 sahneye böler, her sahne için doğru motoru seçer (Paper.js, PixiJS, HyperFrames, Three.js, Manim, levha), sahneleri geçişlerle birleştirir ve kareye kilitli efekt sesi ekler; beğenilen videoyu sahne sahne İngilizce isteme çeviren `referans` becerisini de içerir (MIT).
- https://github.com/latent-spaces/brag - Bir projeyi tek komutla kısa, paylaşılabilir bir lansman videosuna çeviren ajan becerisi: hikâyeyi, tonu ve gösterilecek anları kendisi kurar, üretimi Hyperframes'e devreder; proje kodunu doğrudan okur, canlı URL veya ekran görüntüsü istemez ve `brag-output/` altında plan, kompozisyon brifi, paylaşım metni ve `brag.mp4` üretir. `brag-slim` varyantı Hyperframes ve paketlenmiş varlık olmadan tek dosyayla aynı işi yapar (MIT; Node 22+, FFmpeg ve `npx hyperframes` gerekir).

### 6.2 Render Motorları ve Animasyon Kütüphaneleri

- https://github.com/motiondivision/motion - React, Vue ve JavaScript için gesture, yay, layout geçişi ve scroll bağlantılı animasyon kütüphanesi (eski adı Framer Motion).
- https://github.com/heygen-com/hyperframes - HTML, CSS ve medyayı deterministik MP4'e çeviren açık kaynak çatı; CLI, ajan becerileri ve barındırılan iş akışları için tasarlandı.
- https://github.com/remotion-dev/remotion - React bileşenleriyle programatik video üretme kütüphanesi.

### 6.3 Üretim Hattı ve Koleksiyonlar

- https://github.com/calesthio/OpenMontage - Ajanı otonom video stüdyosuna çeviren açık kaynak sistem: Remotion, FFmpeg ve yapay zekâ video/ses modellerini (Veo, Kling, TTS) 12 üretim hattında orkestre eder.

## 7. 3B Modelleme ve Sahne

Görselden veya Blender'dan kod tabanlı 3B model ve sahne üretirken buraya bak.

- https://github.com/img2threejs/img2threejs - Referans görseldeki nesneyi fotogrametri veya hazır varlık kullanmadan, kalite kapılı ve animasyona hazır prosedürel Three.js koduyla yeniden inşa eden beceri.
- https://github.com/ahujasid/mcp-for-blender - Blender'ı MCP üzerinden ajana bağlayan sunucu ve eklenti: istemli 3B modelleme, sahne kurma ve manipülasyon (eski adı blender-mcp).
- https://github.com/arjun988/blender-skills - Cursor, Claude Code, Kiro ve Codex için 94 uzman Blender becerisi: blockout'tan motor ihracına üretim hattı; `blender-director` isteği modelleme, UV, materyal, rigging, LOD ve export becerilerine yönlendirir, adımlar Blender MCP üzerinden Blender'da yürütülür (MIT).

## 8. Metin ve Üslup

İngilizce metin üretirken veya düzyazıyı yeniden yazarken üslup kararları için buraya bak.

- https://github.com/SHADOWPR0/beautiful_prose - İngilizce düzyazıyı modern yapay zekâ kalıplarından (em dash, "şu değil bu" kurgusu, terapötik ton, dolgu) arındıran katı üslup sözleşmesi; her isteğe kayıt, yoğunluk, sıcaklık ve uzunluk etiketiyle yön verilir.
- https://github.com/blader/humanizer - Yapay zekâ yazımının izlerini silen ajan becerisi; Wikipedia'nın "AI yazımı belirtileri" rehberine dayanır, anlamı değiştirmez.

## 9. Araştırma, SEO ve Pazarlama

Web'de araştırma yaparken, arama görünürlüğünü ve pazarlama içeriğini yönetirken buraya bak.

- https://github.com/Panniantong/Agent-Reach - Ajana internet gözü: Twitter, Reddit, YouTube, GitHub, Bilibili ve XiaoHongShu okuma/arama için tek CLI, API ücreti yok.
- https://github.com/every-app/open-seo - Semrush ve Ahrefs'e açık kaynak alternatif; anahtar kelime araştırması, site denetimi ve geri bağlantı analizi.
- https://github.com/Auriti-Labs/geo-optimizer-skill - Sitenizin ChatGPT, Perplexity, Gemini ve Google AI Overviews tarafından alıntılanıp alıntılanmadığını 0-100 puanlayan açık kaynak GEO/AEO denetim aracı; CLI, Python ve MCP.
- https://github.com/AminForou/mcp-gsc - Google Search Console verisini doğal dille sorgulamak için MCP sunucusu; Claude Desktop, Cursor, Codex CLI gibi istemcilerle çalışır.
- https://github.com/eyaprak/skills/tree/main/seo-expert - Uçtan uca SEO içerik üretim hattı: trend analizi, derin araştırma, ana hat planlama, kalite kapılı yazım ve yayına hazır HTML çıktısı.

## 10. 3B Simülatör ve Makine Anlatımı

Bir makinenin nasıl çalıştığını sökülebilir 3B sayfayla anlatmak veya o sayfayı 60 fps videoya kaydetmek gerektiğinde buraya bak.

- https://github.com/elvarofficial/teardown - Herhangi bir makineyi (motor, iniş takımı, yürüme mekanizması, pompa, şanzıman) tek çevrimdışı HTML sayfasında çalışan, panelleri aynı modelden beslenen, parçaları sökülebilen ve boşta kendi kendine tur atan 3B simülatöre çeviren; ardından turu kare kare 60 fps videoya ve eşzamanlı prosedürel sese kaydeden Claude Code becerisi.

## 11. Filigran ve İçerik Temizliği

Sahip olunan içerikteki AI köken izlerini kaldırmak veya yayına hazır metni temizlemek gerektiğinde buraya bak.

- https://github.com/guillaumemeyer/watermarks-remover - Çok üreticili AI köken izlerini kaldıran gizlilik odaklı uygulama ve ajan becerisi: görünmez Unicode (A katmanı), yeniden yazımla istatistiksel metin filigranı (B katmanı) ve PNG/JPEG/PDF/DOCX/MP4 gibi dosyalarda C2PA/EXIF/XMP üst verisi; iki beceri (`remove-ai-marks`, `clean-user-facing-text`) ve `127.0.0.1:8765` üzerindeki yerel HTTP hizmetiyle çalışır.

## 12. Kaydırmalı Web Siteleri

Kaydırmayla açılan sinematik tanıtım sayfası üretmek ve sonucu gerçek tarayıcıda doğrulamak gerektiğinde buraya bak.

- https://github.com/nateherkai/scroll-craft - Kaydırma zaman çizelgesine bağlı premium tanıtım sayfaları üreten ajan becerisi: sekiz birbirini dışlayan sayfa grameri, bağımsız derinlik düzlemleri, zorunlu imza etkileşimi, tek mühendislik zirvesi ve kaydırma karelerini gerçek tarayıcıda doğrulayan kontrol hattı; `plugins/nateherk-design/skills/scroll-craft/` klasörü olduğu gibi kopyalanır.
## 13. Oyun Geliştirme

Oyun geliştirme işlerinde motoru parmak izinden tanıyıp doğru beceri setini yüklemek için buraya bak; oyun videosu ve ses §6'da, 3B varlık ve sahne §7'de, oyun dışı arayüz §4'tedir.

- https://github.com/gamedev-skills/awesome-gamedev-agent-skills - 79 oyun geliştirme becerisi ve bir yönlendirici: Godot, Unity, Unreal, Ebitengine, Bevy, Phaser, PixiJS, three.js, Defold, LÖVE, pygame ve Roblox için motor-tespitli beceri seti; isteği motor parmak izinden (`project.godot`, `Assets/`+`ProjectVersion.txt`, `*.uproject`, `package.json`, `Cargo.toml`, `game.project`) tanır ve yalnız gereken 2-3 beceriyi yükler. 15 disiplin, 9 tür, 5 iş akışı becerisi ve `gamedev-router` içerir; 366 kör testte doğru becerinin %98,7 yüklendiğini iddia eder (üretici ölçümü, Apache-2.0).
