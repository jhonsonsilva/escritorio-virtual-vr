#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAPS_DIR="${ROOT_DIR}/maps"
STARTER_DIR="${MAPS_DIR}/starter-kit"
STARTER_REPO="https://github.com/workadventure/map-starter-kit.git"

mkdir -p "${MAPS_DIR}"

if [ ! -d "${STARTER_DIR}/.git" ]; then
  echo "Clonando WorkAdventure Map Starter Kit..."
  git clone --depth 1 "${STARTER_REPO}" "${STARTER_DIR}"
else
  echo "Map Starter Kit já existe. Atualizando arquivos upstream..."
  git -C "${STARTER_DIR}" pull --ff-only || true
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado. Instale Node.js antes de gerar os mapas."
  exit 1
fi

echo "Gerando Escritório Virtual V5 — PLANTA PREMIUM FINAL..."
node "${ROOT_DIR}/scripts/generate-playable-v5.js"

cat <<EOF

V5 PREMIUM FINAL preparada com sucesso.

Arquivo recomendado para teste:
  ${STARTER_DIR}/vr-office-v5.tmj

A V5 contém:
  - Sala CEO premium
  - Sala Diretor Audiovisual tecnológica
  - Produção com exatamente 4 mesas/computadores
  - 4 Salas Privativas
  - Sala de Descanso
  - Recepção
  - Auditório para reunião geral
  - Corredores internos
  - Vidros e acabamento premium
  - Spawn na recepção
  - Colisões nos principais elementos
  - Tileset próprio e embutido no TMJ

IMPORTANTE:
  A V5 é independente das versões V1/V2/V3.
  Esta é a planta de referência oficial para a próxima fase do Escritório Virtual VR.

Para iniciar:
  cd "${STARTER_DIR}"
  npm install
  npm run start

Na tela do starter kit, escolha:
  vr-office-v5.tmj
EOF
