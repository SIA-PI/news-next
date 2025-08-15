# Docker Build - SIA News Next.js

## Problema Resolvido

O erro `destination does not start with /, http://, or https://` estava ocorrendo porque a variável de ambiente `NEXT_PUBLIC_BASE_URL` não estava sendo passada corretamente durante o build do Docker.

## Soluções Implementadas

### 1. Correção do Dockerfile

- Adicionado `ARG NEXT_PUBLIC_BASE_URL` no estágio `builder`
- Configurado `ENV NEXT_PUBLIC_BASE_URL` com valor padrão
- Corrigido o mesmo problema no estágio `runner`

### 2. Correção do compose.yml

- Corrigida a sintaxe do `build-args` (removido os dois pontos)
- Adicionada validação do healthcheck

### 3. Melhorias na Configuração Next.js

- Adicionada validação da variável de ambiente
- Configurado valor padrão para fallback

### 4. Otimizações

- Criado `.dockerignore` para otimizar o build
- Scripts de build para Linux e Windows
- Configuração de cache do pnpm

## Como Executar o Build

### Opção 1: Docker Compose (Recomendado)

```bash
docker-compose up --build
```

### Opção 2: Script de Build

#### Linux/Mac:
```bash
chmod +x build.sh
./build.sh
```

#### Windows (PowerShell):
```powershell
.\build.ps1
```

### Opção 3: Docker Build Direto

```bash
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL=https://n8n.sia.pi.gov.br \
  -t sia-news-next:latest \
  .
```

## Variáveis de Ambiente

- `NEXT_PUBLIC_BASE_URL`: URL base da API backend (padrão: https://n8n.sia.pi.gov.br)
- `NEXTAUTH_SECRET`: Secret para autenticação
- `JWT_SECRET`: Secret para JWT
- `PORT`: Porta da aplicação (padrão: 3010)

## Estrutura do Dockerfile

1. **base**: Imagem base Node.js Alpine
2. **deps**: Instalação de dependências
3. **builder**: Build da aplicação Next.js
4. **runner**: Imagem de produção otimizada

## Troubleshooting

### Erro de Build
Se o build falhar, verifique:
- Docker está rodando
- Variáveis de ambiente estão definidas
- Arquivos de lock estão sincronizados

### Erro de Rewrite
Se o erro de rewrite persistir:
- Verifique se `NEXT_PUBLIC_BASE_URL` está definida
- Confirme que a URL começa com `http://` ou `https://`

### Performance
Para melhorar a performance do build:
- Use cache de camadas Docker
- Configure `.dockerignore` adequadamente
- Use buildkit: `DOCKER_BUILDKIT=1 docker build`
