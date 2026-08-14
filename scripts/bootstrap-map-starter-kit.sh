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

if command -v python3 >/dev/null 2>&1 && [ -f "${ROOT_DIR}/scripts/generate-vr-layout.py" ]; then
  echo "Gerando planta-guia..."
  python3 "${ROOT_DIR}/scripts/generate-vr-layout.py" "${STARTER_DIR}/office.tmj" "${STARTER_DIR}/vr-office.tmj"
else
  cp -f "${STARTER_DIR}/office.tmj" "${STARTER_DIR}/vr-office.tmj"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não encontrado. A planta-guia foi criada, mas a V1 visual não pôde ser gerada."
  exit 0
fi

echo "Gerando Escritório Virtual V1 estrutural..."
node "${ROOT_DIR}/scripts/generate-playable-v1.js"

cat <<EOF

V1 preparada com sucesso.

Arquivo para teste:
  ${STARTER_DIR}/vr-office-v1.tmj

A V1 contém:
  - Sala CEO — Victor Romero
  - Sala Diretor Audiovisual
  - Produção — 3 estações
  - 4 Salas Privativas
  - Corredor Central
  - Área de Convivência
  - Auditório
  - Recepção
  - Porta interna obrigatória para o Auditório

Para iniciar o Map Starter Kit:
  cd "${STARTER_DIR}"
  npm install
  npm run start

Observação: esta é a V1 ESTRUTURAL. O cenário padrão é ocultado e substituído por uma planta visual própria. Colisões e acabamento pixel-art premium entram na próxima iteração após validarmos a circulação.
EOF
