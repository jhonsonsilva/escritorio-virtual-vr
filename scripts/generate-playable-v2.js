#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const starter = path.join(root, 'maps', 'starter-kit');
const output = path.join(starter, 'vr-office-v2.tmj');
const tilesSource = path.join(root, 'assets', 'maps', 'vr-office-v2-tiles.svg');
const tilesTarget = path.join(starter, 'vr-office-v2-tiles.svg');

if (!fs.existsSync(starter)) {
  console.error('Starter kit não encontrado. Rode scripts/bootstrap-map-starter-kit.sh primeiro.');
  process.exit(1);
}
if (!fs.existsSync(tilesSource)) {
  console.error('Tiles V2 não encontrados.');
  process.exit(1);
}

const W = 40;
const H = 28;
const TW = 32;
const TH = 32;
const count = W * H;

const TILE = {
  WALL: 1,
  WOOD: 2,
  STONE: 3,
  PRIVATE: 4,
  DOOR: 5,
  DARK: 6,
  DESK: 7,
  PLANT: 8,
  CEO: 9,
  AV: 10,
  PROD: 11,
  PRIV: 12,
  AUD: 13,
  REC: 14,
};

const floor = new Array(count).fill(0);
const walls = new Array(count).fill(0);
const decor = new Array(count).fill(0);
const start = new Array(count).fill(0);

const idx = (x, y) => y * W + x;
const put = (layer, x, y, gid) => {
  if (x >= 0 && y >= 0 && x < W && y < H) layer[idx(x, y)] = gid;
};
const fill = (layer, x1, y1, x2, y2, gid) => {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) put(layer, x, y, gid);
};
const lineH = (layer, x1, x2, y, gid) => fill(layer, x1, y, x2, y, gid);
const lineV = (layer, x, y1, y2, gid) => fill(layer, x, y1, x, y2, gid);

function room(x1, y1, x2, y2, floorGid, doors = []) {
  fill(floor, x1 + 1, y1 + 1, x2 - 1, y2 - 1, floorGid);
  lineH(walls, x1, x2, y1, TILE.WALL);
  lineH(walls, x1, x2, y2, TILE.WALL);
  lineV(walls, x1, y1, y2, TILE.WALL);
  lineV(walls, x2, y1, y2, TILE.WALL);
  for (const [x, y] of doors) {
    put(walls, x, y, 0);
    put(floor, x, y, TILE.DOOR);
  }
}

// Base do prédio.
fill(floor, 1, 1, W - 2, H - 2, TILE.WOOD);
lineH(walls, 0, W - 1, 0, TILE.WALL);
lineH(walls, 0, W - 1, H - 1, TILE.WALL);
lineV(walls, 0, 0, H - 1, TILE.WALL);
lineV(walls, W - 1, 0, H - 1, TILE.WALL);

// Faixa superior: três salas executivas/de produção.
room(1, 1, 11, 8, TILE.STONE, [[6, 8]]);
room(13, 1, 23, 8, TILE.STONE, [[18, 8]]);
room(25, 1, 38, 8, TILE.DARK, [[31, 8]]);

// Privativas à esquerda, corredor no miolo.
room(1, 10, 8, 13, TILE.PRIVATE, [[8, 11]]);
room(1, 14, 8, 17, TILE.PRIVATE, [[8, 15]]);
room(1, 18, 8, 21, TILE.PRIVATE, [[8, 19]]);
room(1, 22, 8, 26, TILE.PRIVATE, [[8, 24]]);
fill(floor, 9, 9, 23, 26, TILE.WOOD);

// Convivência e auditório à direita.
room(25, 10, 38, 16, TILE.STONE, [[25, 13]]);
room(25, 18, 38, 26, TILE.DARK, [[25, 22]]); // porta obrigatoriamente interna

// Recepção ocupa o eixo inferior central, ligada ao corredor.
fill(floor, 10, 22, 23, 26, TILE.STONE);
lineH(walls, 9, 24, 27, TILE.WALL);
put(walls, 16, 27, 0);
put(walls, 17, 27, 0);
put(floor, 16, 27, TILE.DOOR);
put(floor, 17, 27, TILE.DOOR);

// Sinalização visual das salas.
put(decor, 2, 2, TILE.CEO);
put(decor, 14, 2, TILE.AV);
put(decor, 26, 2, TILE.PROD);
for (const y of [11, 15, 19, 23]) put(decor, 2, y, TILE.PRIV);
put(decor, 26, 19, TILE.AUD);
put(decor, 11, 23, TILE.REC);

// Mobiliário básico.
for (const p of [[4,4],[16,4],[28,4],[31,4],[34,4],[3,12],[3,16],[3,20],[3,24],[28,12],[32,12],[28,21],[31,21],[34,21],[13,24],[17,24],[21,24]]) put(decor, p[0], p[1], TILE.DESK);
for (const p of [[2,7],[10,2],[14,7],[22,2],[26,7],[37,2],[10,11],[22,11],[37,15],[10,25],[23,25],[37,25]]) put(decor, p[0], p[1], TILE.PLANT);

// Spawn na recepção.
for (const p of [[16,25],[17,25],[18,25],[16,24],[17,24],[18,24]]) put(start, p[0], p[1], TILE.STONE);

let id = 1;
const tileLayer = (name, data) => ({
  id: id++, name, type: 'tilelayer', width: W, height: H, x: 0, y: 0,
  opacity: 1, visible: true, data
});

const map = {
  compressionlevel: -1,
  height: H,
  infinite: false,
  layers: [
    tileLayer('VR_FLOOR', floor),
    { id: id++, name: 'floorLayer', type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects: [] },
    tileLayer('VR_WALLS', walls),
    tileLayer('VR_FURNITURE', decor),
    tileLayer('start', start)
  ],
  nextlayerid: id,
  nextobjectid: 1,
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tiledversion: '1.11.2',
  tileheight: TH,
  tilesets: [{
    firstgid: 1,
    columns: 14,
    image: 'vr-office-v2-tiles.svg',
    imageheight: 32,
    imagewidth: 448,
    margin: 0,
    name: 'VR Office V2 Embedded Tiles',
    spacing: 0,
    tilecount: 14,
    tileheight: 32,
    tilewidth: 32,
    tiles: [
      { id: 0, properties: [{ name: 'collides', type: 'bool', value: true }] },
      { id: 6, properties: [{ name: 'collides', type: 'bool', value: true }] },
      { id: 7, properties: [{ name: 'collides', type: 'bool', value: true }] }
    ]
  }],
  tilewidth: TW,
  type: 'map',
  version: '1.10',
  width: W,
  backgroundcolor: '#0f141b',
  properties: [
    { name: 'mapName', type: 'string', value: 'Escritório Virtual VR — V2' },
    { name: 'mapDescription', type: 'string', value: 'Planta independente V2: CEO Victor Romero, Audiovisual, Produção, 4 Privativas, Convivência, Auditório e Recepção.' },
    { name: 'vrVersion', type: 'string', value: 'V2-INDEPENDENTE' }
  ]
};

fs.copyFileSync(tilesSource, tilesTarget);
fs.writeFileSync(output, JSON.stringify(map, null, 2) + '\n');

console.log('V2 INDEPENDENTE gerada com sucesso:');
console.log(output);
console.log('Mapa padrão herdado: NÃO');
console.log('Tileset embutido no TMJ: SIM');
console.log('floorLayer obrigatório: SIM');
console.log('start na recepção: SIM');
console.log('Auditório com porta pelo corredor interno: SIM');
console.log('4 privativas: SIM');
console.log('Produção com 3 estações: SIM');
