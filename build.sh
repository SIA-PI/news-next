#!/bin/bash

# Script de build para a aplicação Next.js
set -e

echo "🚀 Iniciando build da aplicação Next.js..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Limpar containers e imagens antigas (opcional)
read -p "🧹 Deseja limpar containers e imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Limpando containers e imagens antigas..."
    docker system prune -f
fi

# Build da imagem
echo "🔨 Construindo imagem Docker..."
docker build \
    --build-arg NEXT_PUBLIC_BASE_URL=https://n8n.sia.pi.gov.br \
    -t sia-news-next:latest \
    .

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "🚀 Para executar a aplicação, use: docker run -p 3010:3010 sia-news-next:latest"
else
    echo "❌ Build falhou!"
    exit 1
fi
