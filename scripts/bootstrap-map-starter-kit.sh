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

echo "Gerando Escritório Virtual V2 independente..."
node "${ROOT_DIR}/scripts/generate-playable-v2.js"

echo ""
echo "Gerando Escritório Virtual V3 PREMIUM..."
node "${ROOT_DIR}/scripts/generate-playable-v3.js"

cat <<EOF

V3 PREMIUM preparada com sucesso.

Arquivo recomendado para teste:
  ${STARTER_DIR}/vr-office-v3.tmj

A V3 contém:
  - Sala CEO — Victor Romero com ambientação executiva
  - Sala Diretor Audiovisual com identidade própria
  - Produção — exatamente 3 estações completas
  - Recepção mobiliada e spawn
  - Área de Convivência central com sofás e mesa
  - 4 Salas Privativas mobiliadas
  - Auditório com palco, tela e fileiras de cadeiras
  - Porta do Auditório pelo corredor interno
  - Corredores decorados
  - Colisão em paredes e mobiliário principal
  - Tileset premium próprio e embutido no TMJ

IMPORTANTE:
  A V3 NÃO herda o cenário visual do office.tmj.
  É um mapa independente feito especificamente para o Escritório Virtual VR.

Para iniciar:
  cd "${STARTER_DIR}"
  npm install
  npm run start

Na tela do starter kit, escolha:
  vr-office-v3.tmj
EOF
