#!/bin/bash

echo "🔧 Corrigindo pnpm-lock.yaml e preparando para deploy..."

# Instala e sincroniza as dependências
pnpm install

# Verifica se houve alteração no lockfile
if git diff --quiet pnpm-lock.yaml; then
  echo "✅ pnpm-lock.yaml já está atualizado. Nenhuma alteração necessária."
else
  echo "🚀 Atualizando pnpm-lock.yaml no repositório..."
  git add pnpm-lock.yaml
  git commit -m "fix: sync pnpm-lock.yaml with package.json for Netlify deploy"
  git push
  echo "🎯 Lockfile atualizado e enviado para o repositório. Agora rode o deploy no Netlify."
fi

echo "✅ Processo concluído."
