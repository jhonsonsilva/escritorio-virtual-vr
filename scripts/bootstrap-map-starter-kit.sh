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
  echo "Map Starter Kit já existe. Atualizando..."
  git -C "${STARTER_DIR}" pull --ff-only
fi

if [ ! -f "${STARTER_DIR}/vr-office.tmj" ]; then
  cp "${STARTER_DIR}/office.tmj" "${STARTER_DIR}/vr-office.tmj"
  echo "Criado vr-office.tmj a partir do office.tmj oficial."
else
  echo "vr-office.tmj já existe; mantendo alterações locais."
fi

cat <<EOF

Mapa preparado em:
  ${STARTER_DIR}/vr-office.tmj

Para editar visualmente, abra esse arquivo no Tiled.

Para testar o starter kit localmente:
  cd "${STARTER_DIR}"
  npm install
  npm run start

Depois use o botão 'Test this map' do starter kit.
EOF
