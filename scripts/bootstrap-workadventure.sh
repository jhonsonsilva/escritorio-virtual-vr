#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM_DIR="${ROOT_DIR}/vendor/workadventure"
UPSTREAM_REPO="https://github.com/workadventure/workadventure.git"

if ! command -v git >/dev/null 2>&1; then
  echo "Erro: Git não encontrado."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Erro: Docker não encontrado. Instale Docker Desktop/Engine antes de continuar."
  exit 1
fi

mkdir -p "${ROOT_DIR}/vendor"

if [ ! -d "${UPSTREAM_DIR}/.git" ]; then
  echo "Clonando WorkAdventure upstream..."
  git clone --depth 1 "${UPSTREAM_REPO}" "${UPSTREAM_DIR}"
else
  echo "WorkAdventure já existe. Atualizando referência upstream..."
  git -C "${UPSTREAM_DIR}" pull --ff-only
fi

cat <<EOF

Bootstrap concluído.

Próximos passos:
  cd "${UPSTREAM_DIR}"
  docker compose up

Depois abra:
  http://play.workadventure.localhost/

Observação:
  O código upstream fica em vendor/workadventure e NÃO deve ser commitado neste repositório.
  Nossa personalização ficará separada para facilitar upgrades e revisão de licença.
EOF
