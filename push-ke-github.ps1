# ============================================================
# Script: Push kode ke GitHub supaya Railway/Vercel auto deploy
# Jalankan sekali dari folder ini (buka Terminal di Cursor, lalu jalankan)
# ============================================================

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/mbeni1989-bot/temu-kembali.git"

# Cari folder yang ada package.json (bisa dari folder ini atau satu level atas)
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
if (-not (Test-Path (Join-Path $root "package.json"))) {
    $inner = Join-Path $root "temukembali-main"
    if (Test-Path (Join-Path $inner "package.json")) {
        Set-Location $inner
        $root = Get-Location
    } else {
        Set-Location $root
        if (-not (Test-Path "package.json")) {
            Write-Host "ERROR: Jalankan script dari folder project (yang ada package.json)." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Set-Location $root
}

Write-Host "`n[1/6] Folder project: $root" -ForegroundColor Cyan

# Cek Git terpasang
try {
    $null = git --version
} catch {
    Write-Host "ERROR: Git belum terpasang. Install dulu: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Inisialisasi Git jika belum
if (-not (Test-Path ".git")) {
    Write-Host "[2/6] Inisialisasi Git..." -ForegroundColor Cyan
    git init
    git remote add origin $repoUrl
} else {
    Write-Host "[2/6] Git sudah ada. Cek remote..." -ForegroundColor Cyan
    $rem = git remote get-url origin 2>$null
    if (-not $rem) {
        git remote add origin $repoUrl
    }
}

# Add semua file
Write-Host "[3/6] Menambah file..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "[4/6] Commit..." -ForegroundColor Cyan
git commit -m "fix: redirect loop login, Umami, tsconfig, deployment docs" 2>$null
if ($LASTEXITCODE -ne 0) {
    $msg = git status --short 2>$null
    if (-not $msg) {
        Write-Host "Tidak ada perubahan untuk di-commit (mungkin sudah push). Selesai." -ForegroundColor Yellow
        exit 0
    }
    git commit -m "fix: redirect loop login, Umami, tsconfig, deployment docs"
}

# Branch main
Write-Host "[5/6] Pastikan branch main..." -ForegroundColor Cyan
git branch -M main 2>$null

# Push
Write-Host "[6/6] Push ke GitHub (mungkin diminta login sekali)..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSelesai. Railway/Vercel akan auto deploy dalam beberapa menit." -ForegroundColor Green
} else {
    Write-Host "`nPush gagal. Kalau diminta login:" -ForegroundColor Yellow
    Write-Host "  - Bisa pakai GitHub Desktop, atau" -ForegroundColor Yellow
    Write-Host "  - Di browser akan terbuka untuk login GitHub." -ForegroundColor Yellow
}
