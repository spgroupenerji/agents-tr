---
description: "Araç rolleri ve sahiplik: tek yazıcı/tek okuyucu, olay ve depo sahipliği, kaynak bütçesi, çakışma kuralları."
version: "v202611140625"
---

# Araç Rolleri ve Sahiplik

Tek yazıcı / tek okuyucu: aynı olayın, aynı verinin ve aynı sorunun tek sahibi olur. İkinci araç yalnız gözlemci kalır.

## Roller

| Rol | Sahip | Benzersiz kanıt | Devre dışı |
| --- | --- | --- | --- |
| Hafıza (epizodik) | claude-mem | Oturumlar arası gözlem ve bağlam | Karar kaydı olarak kullanılmaz |
| Karar (semantik) | trace-mcp karar defteri | Kod bağlı karar, geçerlilik, denetim | Gözlem kaydı olarak kullanılmaz |
| Bağlam sıkıştırma | context-mode | Büyük çıktıyı bağlam dışına taşır | Hook olarak kurulmaz; yalnız çağrı anında |
| Kod grafiği ve etki | ripwire (CLI) + trace-mcp (talep üzerine) | Blast radius, framework kenarı | trace daemon sürekli çalışmaz |
| Sembol ve düzenleme | serena | LSP referansı, güvenli düzenleme | — |
| Doküman | context7 | Sürüm ve API gerçeği | — |

## Olay sahipliği (hook)

| Olay | Sahip | Kural |
| --- | --- | --- |
| SessionStart | claude-mem | Tek enjeksiyon |
| PostToolUse | context-mode | Yalnız büyük çıktı; aynı çıktı ikinci kez işlenmez |
| Stop / SessionEnd | claude-mem | Tek özet |
| PreToolUse | yok | İkinci yazıcı yasak |

## Depo sahipliği

| Veri | Depo | Yazıcı | Yeniden üretilebilir |
| --- | --- | --- | --- |
| Gözlem ve karar | `~/.claude-mem` | claude-mem | Hayır, yedeklenir |
| Araç çıktısı | context-mode | context-mode | Evet |
| Kod grafiği | `~/.trace` | trace-mcp | Evet |
| Repo kararı | `.trail/` (pilot) | Trail | Hayır |

## Kaynak bütçesi

- Sürekli daemon: yalnız claude-mem worker.
- trace-mcp: stdio, talep üzerine; `serve-http` daemon kapalı.
- context-mode: yalnız çağrı anında alt süreç.
- Üst sınır: eşzamanlı bir daemon ve bir geçici süreç.

## Çakışma kuralları

1. Aynı olayda iki hook varsa biri observer-only yapılır; sıralama belirsizse ikinci kaldırılır.
2. Aynı soruya iki araç cevap veriyorsa yönlendirme tablosu geçerlidir; ikinci çağrı yapılmaz.
3. Kurulumcu config'e yazmadan önce yedek alır, idempotent yazar, doğrular; kalıntı bırakırsa geri alır.
4. Sağlık sessiz kalamaz: kopuk MCP, ölü daemon ve port çakışması raporda görünür.

## Araç yüzeyi bütçesi

- Sürekli yük hedefi: 180 araç ve altı. REA (229 araç) tersine mühendislik dışında kapalıdır.
- Görev özel araçlar yalnız o görevde açılır; açma ve kapama aynı release'te belgelenir.
