---
description: "Zorunlu katalogdan çıkarılan, ihtiyaç halinde kurulabilecek kod zekâsı ve grafik alternatifleri."
version: "v202611100654"
---

# Alternatifler

> Sade bağlantı listesi: [linkler.md](linkler.md)

Bu dizin, zorunlu kurulum kataloğundan ([01-yuklenecekler](../01-yuklenecekler/README.md)) çıkarılan araçları alternatif olarak saklar. Zorunlu taban kod zekâsı araçları 01'deki ripwire (keşif ve kalite kapısı), Serena (semantik düzenleme) ve trace-mcp (framework-farkındalıklı grafik); buradakiler yalnız ihtiyaç halinde kurulur ve kurulum protokolü bu dizine dokunmaz.

## 1. Kod Zekâsı ve Grafik Alternatifleri

- https://github.com/trailhq/Trail-Code - Kod tabanı haritasını ve ekip kararlarını (`.trail/`) MCP ve hook'larla ajana taşıyan bağlam katmanı (eski adı graft); hook'ları Claude Code/Codex/Cursor ağırlıklı olduğu için zorunlu katalogdan çıkarıldı (MIT).
- https://github.com/abhigyanpatwari/GitNexus - Kod tabanını yerel bilgi grafiğine çıkarıp bağımlılık ve "blast radius" sorgularını MCP/CLI üzerinden yanıtlayan motor (zorunlu katalogdan çıkarıldı; alternatif).
- https://github.com/colbymchenry/codegraph - SQLite tabanlı yerel bilgi grafiğini kod değiştikçe otomatik senkronize ederek sembol ve akış sorgularını MCP'den sunan tamamen yerel motor (zorunlu katalogdan çıkarıldı; alternatif).
- https://github.com/Graphify-Labs/graphify - Kod, doküman, SQL şeması ve PDF'leri yerel AST ayrıştırmasıyla sorgulanabilir bilgi grafiğine çeviren beceri/MCP (zorunlu katalogdan çıkarıldı; alternatif).
