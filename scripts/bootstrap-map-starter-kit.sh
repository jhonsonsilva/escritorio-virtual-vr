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
  echo "Node.js não encontrado. Instale Node.js antes de gerar a V2."
  exit 1
fi

echo "Gerando Escritório Virtual V2 independente..."
node "${ROOT_DIR}/scripts/generate-playable-v2.js"

cat <<EOF

V2 INDEPENDENTE preparada com sucesso.

Arquivo para teste:
  ${STARTER_DIR}/vr-office-v2.tmj

A V2 contém:
  - Sala CEO — Victor Romero
  - Sala Diretor Audiovisual
  - Produção — 3 estações
  - 4 Salas Privativas
  - Corredor Central
  - Área de Convivência
  - Auditório com porta interna pelo corredor
  - Recepção / spawn
  - Paredes e móveis com colisão
  - Tiles próprios com linguagem visual premium estrutural

IMPORTANTE:
  A V2 NÃO herda o cenário visual do office.tmj.
  O .tmj é gerado de forma independente e o tileset é EMBUTIDO no arquivo,
  conforme as exigências atuais do WorkAdventure.

Para iniciar:
  cd "${STARTER_DIR}"
  npm install
  npm run start

Na tela do starter kit, escolha:
  vr-office-v2.tmj
EOF
