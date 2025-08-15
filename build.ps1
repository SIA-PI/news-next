# Script de build para a aplicação Next.js (PowerShell)
param(
    [string]$BaseUrl = "https://n8n.sia.pi.gov.br"
)

Write-Host "🚀 Iniciando build da aplicação Next.js..." -ForegroundColor Green

# Verificar se o Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Limpar containers e imagens antigas (opcional)
$cleanup = Read-Host "🧹 Deseja limpar containers e imagens antigas? (y/N)"
if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    Write-Host "🧹 Limpando containers e imagens antigas..." -ForegroundColor Yellow
    docker system prune -f
}

# Build da imagem
Write-Host "🔨 Construindo imagem Docker..." -ForegroundColor Yellow
docker build `
    --build-arg NEXT_PUBLIC_BASE_URL=$BaseUrl `
    -t sia-news-next:latest `
    .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host "🚀 Para executar a aplicação, use: docker run -p 3010:3010 sia-news-next:latest" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build falhou!" -ForegroundColor Red
    exit 1
}
