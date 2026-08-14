#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const starter = path.join(root, 'maps', 'starter-kit');
const source = path.join(starter, 'office.tmj');
const output = path.join(starter, 'vr-office-v1.tmj');
const tilesSvgSource = path.join(root, 'assets', 'maps', 'vr-office-v1-tiles.svg');
const tilesSvgTarget = path.join(starter, 'vr-office-v1-tiles.svg');
const tilesetSource = path.join(root, 'assets', 'maps', 'vr-office-v1-tileset.tsj');
const tilesetTarget = path.join(starter, 'vr-office-v1-tileset.tsj');

for (const required of [source, tilesSvgSource, tilesetSource]) {
  if (!fs.existsSync(required)) {
    console.error(`Arquivo obrigatório não encontrado: ${required}`);
    process.exit(1);
  }
}

const map = JSON.parse(fs.readFileSync(source, 'utf8'));
const width = map.width;
const height = map.height;
const count = width * height;

// GID bem acima dos tilesets do starter kit, evitando qualquer colisão de IDs.
const FIRST_GID = 50000;
const gid = (tileId) => FIRST_GID + tileId;

const TILE = {
  WALL: 0,
  WOOD: 1,
  BLUE: 2,
  GREEN: 3,
  DOOR: 4,
  DARK: 5,
  DESK: 6,
  PLANT: 7
};

const floor = new Array(count).fill(gid(TILE.WOOD));
const walls = new Array(count).fill(0);
const furniture = new Array(count).fill(0);

const index = (x, y) => y * width + x;
const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const put = (layer, x, y, value) => {
  if (inside(x, y)) layer[index(x, y)] = value;
};

function fill(layer, x1, y1, x2, y2, value) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) put(layer, x, y, value);
  }
}

function room(x1, y1, x2, y2, floorTile, doors = []) {
  fill(floor, x1 + 1, y1 + 1, x2 - 1, y2 - 1, gid(floorTile));
  for (let x = x1; x <= x2; x++) {
    put(walls, x, y1, gid(TILE.WALL));
    put(walls, x, y2, gid(TILE.WALL));
  }
  for (let y = y1; y <= y2; y++) {
    put(walls, x1, y, gid(TILE.WALL));
    put(walls, x2, y, gid(TILE.WALL));
  }
  for (const [dx, dy] of doors) {
    put(walls, dx, dy, 0);
    put(floor, dx, dy, gid(TILE.DOOR));
  }
}

// Moldura externa do prédio.
for (let x = 0; x < width; x++) {
  put(walls, x, 0, gid(TILE.WALL));
  put(walls, x, height - 1, gid(TILE.WALL));
}
for (let y = 0; y < height; y++) {
  put(walls, 0, y, gid(TILE.WALL));
  put(walls, width - 1, y, gid(TILE.WALL));
}

// V1 real: as áreas abaixo são desenhadas em tiles, não em image layer.
room(1, 1, 8, 5, TILE.BLUE, [[4, 5]]);             // CEO
room(10, 1, 17, 5, TILE.BLUE, [[13, 5]]);           // Diretor audiovisual
room(19, 1, 29, 5, TILE.DARK, [[24, 5]]);           // Produção
room(1, 7, 6, 9, TILE.GREEN, [[6, 8]]);              // Privativa 01
room(1, 10, 6, 12, TILE.GREEN, [[6, 11]]);           // Privativa 02
room(1, 13, 6, 15, TILE.GREEN, [[6, 14]]);           // Privativa 03
room(1, 16, 6, 19, TILE.GREEN, [[6, 17]]);           // Privativa 04
room(20, 7, 29, 11, TILE.BLUE, [[20, 9]]);           // Convivência
room(20, 13, 29, 19, TILE.DARK, [[20, 16]]);         // Auditório — porta interna

// Corredor central e recepção ficam visualmente distintos.
fill(floor, 8, 7, 18, 19, gid(TILE.WOOD));
fill(floor, 7, 17, 19, 19, gid(TILE.WOOD));
fill(floor, 7, 16, 19, 16, gid(TILE.DARK));

// Mobiliário básico, já suficiente para a mudança ficar inequívoca no mapa.
const desks = [
  [3, 3], [12, 3],
  [21, 3], [24, 3], [27, 3],
  [3, 8], [3, 11], [3, 14], [3, 17],
  [22, 9], [26, 9],
  [22, 15], [24, 15], [26, 15], [22, 17], [24, 17], [26, 17],
  [10, 18], [13, 18], [16, 18]
];
for (const [x, y] of desks) put(furniture, x, y, gid(TILE.DESK));
for (const [x, y] of [[2,2],[7,2],[11,2],[16,2],[20,2],[28,2],[2,18],[18,18],[28,10]]) {
  put(furniture, x, y, gid(TILE.PLANT));
}

let nextId = Math.max(0, ...map.layers.map((l) => l.id || 0)) + 1;
const tileLayer = (name, data) => ({
  id: nextId++,
  name,
  type: 'tilelayer',
  width,
  height,
  x: 0,
  y: 0,
  opacity: 1,
  visible: true,
  data
});

const rooms = [
  ['recepcao', 7, 16, 13, 4, 'public'],
  ['ceo_victor_romero', 1, 1, 8, 5, 'meeting'],
  ['diretor_audiovisual', 10, 1, 8, 5, 'meeting'],
  ['producao', 19, 1, 11, 5, 'team'],
  ['privativa_01', 1, 7, 6, 3, 'private'],
  ['privativa_02', 1, 10, 6, 3, 'private'],
  ['privativa_03', 1, 13, 6, 3, 'private'],
  ['privativa_04', 1, 16, 6, 4, 'private'],
  ['corredor_central', 8, 7, 11, 10, 'circulation'],
  ['convivencia', 20, 7, 10, 5, 'social'],
  ['auditorio', 20, 13, 10, 7, 'auditorium']
];

const zoneLayer = {
  id: nextId++,
  name: 'VR_ROOM_ZONES',
  type: 'objectgroup',
  draworder: 'topdown',
  opacity: 1,
  visible: false,
  x: 0,
  y: 0,
  objects: rooms.map(([name, x, y, w, h, type], i) => ({
    id: i + 1,
    name,
    type: 'vr-room',
    x: x * map.tilewidth,
    y: y * map.tileheight,
    width: w * map.tilewidth,
    height: h * map.tileheight,
    rotation: 0,
    visible: true,
    properties: [
      {name: 'roomId', type: 'string', value: name},
      {name: 'roomType', type: 'string', value: type},
      {name: 'communication', type: 'string', value: type === 'private' ? 'blocked-external' : 'proximity'}
    ]
  }))
};

// Mantém apenas a camada de spawn do starter kit; todo o cenário visual antigo é removido.
const startLayer = map.layers.find((layer) => layer.name === 'start');
if (!startLayer) {
  console.error('Camada start não encontrada no office.tmj do starter kit.');
  process.exit(1);
}
startLayer.visible = true;

map.layers = [
  tileLayer('VR_FLOOR', floor),
  tileLayer('VR_WALLS', walls),
  tileLayer('VR_FURNITURE', furniture),
  startLayer,
  zoneLayer
];

map.tilesets = [
  ...(map.tilesets || []),
  { firstgid: FIRST_GID, source: 'vr-office-v1-tileset.tsj' }
];
map.nextlayerid = nextId;
map.backgroundcolor = '#11161d';
map.properties = [
  ...(map.properties || []).filter((p) => !['vrVersion', 'vrLayout'].includes(p.name)),
  {name: 'vrVersion', type: 'string', value: 'V1-TILEMAP-REAL'},
  {name: 'vrLayout', type: 'string', value: 'Victor Romero Virtual Office'}
];

fs.copyFileSync(tilesSvgSource, tilesSvgTarget);
fs.copyFileSync(tilesetSource, tilesetTarget);
fs.writeFileSync(output, JSON.stringify(map, null, 2) + '\n');

console.log('V1 REAL gerada com sucesso:');
console.log(output);
console.log(`Grade: ${width}x${height} tiles (${width * map.tilewidth}x${height * map.tileheight}px)`);
console.log('Cenário padrão removido: OK');
console.log('Tiles visuais próprios: OK');
console.log('Paredes com colisão: OK');
console.log('Auditório com porta interna: OK');
console.log('4 salas privativas: OK');
console.log('Produção com 3 estações: OK');
