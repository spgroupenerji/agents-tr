[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('ac', 'kapat', 'durum', 'sarmala')]
    [string]$Komut,
    [int]$Port = 0,
    [int]$HedefPid = 0
)

$ErrorActionPreference = 'Stop'
$Kok = Join-Path $env:USERPROFILE '.agents'
$ConfigYolu = Join-Path $Kok 'tarayici.json'
$KayitYolu = Join-Path $Kok 'tarayici-surec.json'

function JsonYaz($yol, $nesne) {
    $json = ConvertTo-Json -InputObject $nesne -Depth 8
    [IO.File]::WriteAllText($yol, $json, [Text.UTF8Encoding]::new($false))
}

function JsonOku($yol) {
    if (-not (Test-Path $yol)) { return $null }
    $ham = Get-Content -Raw -Path $yol
    if ([string]::IsNullOrWhiteSpace($ham)) { return $null }
    return ($ham | ConvertFrom-Json)
}

function ConfigAl {
    $c = JsonOku $ConfigYolu
    if (-not $c) { throw "Tarayici config yok: $ConfigYolu" }
    if (-not $c.uygulama -or -not (Test-Path $c.uygulama)) { throw "Uygulama bulunamadi: $($c.uygulama)" }
    return $c
}

function PortSahibi($p) {
    return (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)
}

function DevToolsSaglikli($p) {
    try {
        $yanit = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$p/json/version" -TimeoutSec 2
        return ($yanit.StatusCode -eq 200)
    } catch { return $false }
}

function KayitAl {
    $k = JsonOku $KayitYolu
    if (-not $k) { return @() }
    return @($k)
}

function KayitYaz($liste) {
    JsonYaz $KayitYolu @($liste)
}

function KayitliSaglikli {
    foreach ($k in @(KayitAl)) {
        if ((PortSahibi $k.port) -eq $k.pid -and (DevToolsSaglikli $k.port)) { return $k }
    }
    return $null
}

function BosPort($alt, $ust) {
    for ($p = $alt; $p -le $ust; $p++) {
        if (-not (PortSahibi $p)) { return $p }
    }
    throw "Port araligi dolu: $alt-$ust"
}

function ElleBul($c) {
    for ($p = [int]$c.portAraligi.alt; $p -le [int]$c.portAraligi.ust; $p++) {
        $sahipPid = PortSahibi $p
        if (-not $sahipPid) { continue }
        $surec = $null
        try { $surec = Get-Process -Id $sahipPid -ErrorAction Stop } catch { $surec = $null }
        if ($surec -and $surec.Path -and ($surec.Path -ieq $c.uygulama) -and (DevToolsSaglikli $p)) {
            $kayit = [pscustomobject]@{
                pid = $sahipPid
                port = $p
                uygulama = $c.uygulama
                mod = "elle"
                basladi = (Get-Date).ToString("o")
            }
            KayitYaz (@(KayitAl) + $kayit)
            return $kayit
        }
    }
    return $null
}

function TarayiciAc {
    $c = ConfigAl
    if ($c.mod -eq 'mevcut') { throw "Mod mevcut: tarayici kullanici tarafindan acik olmali" }
    if ($Port -eq 0) {
        $mevcut = KayitliSaglikli
        if ($mevcut) { return $mevcut }
        $elle = ElleBul $c
        if ($elle) { return $elle }
    }
    $alt = [int]$c.portAraligi.alt
    $ust = [int]$c.portAraligi.ust
    $hedef = if ($Port -gt 0) { $Port } else { BosPort $alt $ust }
    $sahip = PortSahibi $hedef
    if ($sahip) {
        $kayitli = @(KayitAl) | Where-Object { $_.port -eq $hedef -and $_.pid -eq $sahip }
        if ($kayitli -and (DevToolsSaglikli $hedef)) { return $kayitli }
        $surec = $null
        try { $surec = Get-Process -Id $sahip -ErrorAction Stop } catch { $surec = $null }
        if ($surec -and $surec.Path -and ($surec.Path -ieq $c.uygulama) -and (DevToolsSaglikli $hedef)) {
            $kayit = [pscustomobject]@{
                pid = $sahip
                port = $hedef
                uygulama = $c.uygulama
                mod = "elle"
                basladi = (Get-Date).ToString("o")
            }
            KayitYaz (@(KayitAl) + $kayit)
            return $kayit
        }
        throw "Port $hedef alan disi surecte: PID $sahip. Dokunulmaz."
    }
    $argumanlar = @("--remote-debugging-port=$hedef")
    if ($c.mod -eq 'izole') {
        $profil = Join-Path $c.profilKok ("profil-" + $hedef)
        New-Item -ItemType Directory -Force -Path $profil | Out-Null
        $argumanlar += '--user-data-dir="' + $profil + '"'
    } elseif ($c.mod -eq 'harici' -and $c.profil) {
        $argumanlar += '--user-data-dir="' + $c.profil + '"'
    }
    $surec = Start-Process -FilePath $c.uygulama -ArgumentList $argumanlar -PassThru
    $hazir = $false
    for ($i = 0; $i -lt 40; $i++) {
        Start-Sleep -Milliseconds 500
        if (DevToolsSaglikli $hedef) { $hazir = $true; break }
        if ($surec.HasExited) { break }
    }
    if (-not $hazir) {
        if (-not $surec.HasExited) { taskkill /PID $surec.Id /T /F | Out-Null }
        if ($surec.HasExited -and $c.mod -eq 'harici' -and -not $c.profil) {
            throw "Ayni profil tek ornek: yeni ornek icin mod izole veya ayri profil gerekir"
        }
        throw "Tarayici $hedef portunda hazir olmadi"
    }
    $kayit = [pscustomobject]@{
        pid = $surec.Id
        port = $hedef
        uygulama = $c.uygulama
        mod = $c.mod
        basladi = (Get-Date).ToString('o')
    }
    KayitYaz (@(KayitAl) + $kayit)
    return $kayit
}

function TarayiciKapat {
    $liste = @(KayitAl)
    $hedef = $liste | Where-Object { $_.pid -eq $HedefPid }
    if (-not $hedef) { throw "Alan disi PID reddedildi: $HedefPid. Yalniz bu aracla acilan surecler kapatilabilir." }
    taskkill /PID $HedefPid /T /F | Out-Null
    KayitYaz ($liste | Where-Object { $_.pid -ne $HedefPid })
    return [pscustomobject]@{ kapatildi = $HedefPid }
}

function TarayiciDurum {
    $sonuc = @()
    foreach ($k in @(KayitAl)) {
        $canli = $false
        try { $canli = [bool](Get-Process -Id $k.pid -ErrorAction SilentlyContinue) } catch { $canli = $false }
        $sonuc += [pscustomobject]@{ pid = $k.pid; port = $k.port; mod = $k.mod; canli = $canli; devtools = (DevToolsSaglikli $k.port) }
    }
    return @($sonuc)
}

switch ($Komut) {
    'ac' { TarayiciAc | ConvertTo-Json -Depth 8 }
    'kapat' { TarayiciKapat | ConvertTo-Json -Depth 8 }
    'durum' { @(TarayiciDurum) | ConvertTo-Json -Depth 8 }
    'sarmala' {
        $betik = Join-Path $PSScriptRoot 'sarmala.mjs'
        & node $betik
        exit $LASTEXITCODE
    }
}
