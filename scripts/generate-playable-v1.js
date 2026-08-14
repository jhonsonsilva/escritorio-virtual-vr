#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const starter = path.join(root, 'maps', 'starter-kit');
const source = path.join(starter, 'office.tmj');
const output = path.join(starter, 'vr-office-v1.tmj');
const overlaySource = path.join(root, 'assets', 'maps', 'vr-office-v1.svg');
const overlayTarget = path.join(starter, 'vr-office-v1.svg');

if (!fs.existsSync(source)) {
  console.error('office.tmj não encontrado. Rode primeiro scripts/bootstrap-map-starter-kit.sh');
  process.exit(1);
}
if (!fs.existsSync(overlaySource)) {
  console.error('Overlay visual não encontrado em assets/maps/vr-office-v1.svg');
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(source, 'utf8'));
const mapWidth = map.width * map.tilewidth;
const mapHeight = map.height * map.tileheight;

// Esconde o cenário padrão, mas preserva suas camadas/dados como referência e compatibilidade.
for (const layer of map.layers) {
  layer.visible = false;
}

let nextId = Math.max(0, ...map.layers.map((l) => l.id || 0)) + 1;

const visualLayer = {
  id: nextId++,
  name: 'VR_OFFICE_V1_VISUAL',
  type: 'imagelayer',
  image: 'vr-office-v1.svg',
  opacity: 1,
  visible: true,
  x: 0,
  y: 0,
  offsetx: 0,
  offsety: 0
};

const rooms = [
  ['recepcao', 42, 566, 908, 82, 'public'],
  ['ceo_victor_romero', 42, 40, 260, 150, 'meeting'],
  ['diretor_audiovisual', 322, 40, 250, 150, 'meeting'],
  ['producao', 592, 40, 358, 150, 'team'],
  ['privativa_01', 42, 218, 155, 70, 'private'],
  ['privativa_02', 42, 298, 155, 70, 'private'],
  ['privativa_03', 42, 378, 155, 70, 'private'],
  ['privativa_04', 42, 458, 155, 70, 'private'],
  ['corredor_central', 217, 210, 405, 328, 'circulation'],
  ['convivencia', 642, 218, 308, 150, 'social'],
  ['auditorio', 642, 388, 308, 150, 'auditorium']
];

const zoneObjects = rooms.map(([name, x, y, width, height, type], index) => ({
  id: index + 1,
  name,
  type: 'vr-room',
  x, y, width, height,
  rotation: 0,
  visible: true,
  properties: [
    { name: 'roomId', type: 'string', value: name },
    { name: 'roomType', type: 'string', value: type },
    { name: 'communication', type: 'string', value: type === 'private' ? 'blocked-external' : 'proximity' }
  ]
}));

const zonesLayer = {
  id: nextId++,
  name: 'VR_ROOM_ZONES',
  type: 'objectgroup',
  draworder: 'topdown',
  opacity: 1,
  visible: false,
  x: 0,
  y: 0,
  objects: zoneObjects
};

const doorLayer = {
  id: nextId++,
  name: 'VR_DOORS',
  type: 'objectgroup',
  draworder: 'topdown',
  opacity: 1,
  visible: false,
  x: 0,
  y: 0,
  objects: [{
    id: 1,
    name: 'porta_auditorio_interna',
    type: 'internal-door',
    x: 622,
    y: 432,
    width: 20,
    height: 56,
    rotation: 0,
    visible: true,
    properties: [
      { name: 'connectsFrom', type: 'string', value: 'corredor_central' },
      { name: 'connectsTo', type: 'string', value: 'auditorio' },
      { name: 'required', type: 'bool', value: true }
    ]
  }]
};

map.layers = [visualLayer, ...map.layers, zonesLayer, doorLayer];
map.nextlayerid = nextId;
map.backgroundcolor = '#171b22';
map.properties = [
  ...(map.properties || []).filter((p) => !['vrVersion', 'vrLayout'].includes(p.name)),
  { name: 'vrVersion', type: 'string', value: 'V1-STRUCTURAL' },
  { name: 'vrLayout', type: 'string', value: 'Victor Romero Virtual Office' }
];

fs.copyFileSync(overlaySource, overlayTarget);
fs.writeFileSync(output, JSON.stringify(map, null, 2) + '\n');

console.log('V1 jogável gerada com sucesso:');
console.log(output);
console.log(`Dimensão do mapa: ${mapWidth}x${mapHeight}px`);
console.log('Porta interna do auditório: OK');
console.log('4 salas privativas: OK');
console.log('Produção com 3 estações: representada no overlay visual');
