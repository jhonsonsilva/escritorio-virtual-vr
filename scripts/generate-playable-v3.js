#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const starter = path.join(root, 'maps', 'starter-kit');
const output = path.join(starter, 'vr-office-v3.tmj');
const tilesSource = path.join(root, 'assets', 'maps', 'vr-office-v3-tiles.svg');
const tilesTarget = path.join(starter, 'vr-office-v3-tiles.svg');

if (!fs.existsSync(starter)) {
  console.error('Starter kit não encontrado. Rode scripts/bootstrap-map-starter-kit.sh primeiro.');
  process.exit(1);
}
if (!fs.existsSync(tilesSource)) {
  console.error('Tiles V3 não encontrados.');
  process.exit(1);
}

const W = 48;
const H = 34;
const TW = 32;
const TH = 32;
const count = W * H;

const T = {
  WALL: 1, WOOD: 2, STONE: 3, PRIVATE: 4, DOOR: 5, DARK: 6,
  DESK: 7, PLANT: 8, SOFA: 9, CHAIR: 10, SCREEN: 11, RECEPTION: 12,
  ROUND: 13, BOOK: 14, RUG: 15, STAGE: 16, GLASS: 17, LIGHT: 18,
  GOLD: 19, COFFEE: 20, SIDE: 21, LOUNGE: 22, PLAQUE: 23, DIVIDER: 24
};

const floor = new Array(count).fill(0);
const walls = new Array(count).fill(0);
const decor = new Array(count).fill(0);
const start = new Array(count).fill(0);

const idx = (x,y) => y * W + x;
const put = (layer,x,y,v) => { if (x>=0 && y>=0 && x<W && y<H) layer[idx(x,y)] = v; };
const fill = (layer,x1,y1,x2,y2,v) => { for (let y=y1;y<=y2;y++) for (let x=x1;x<=x2;x++) put(layer,x,y,v); };
const lineH = (layer,x1,x2,y,v) => fill(layer,x1,y,x2,y,v);
const lineV = (layer,x,y1,y2,v) => fill(layer,x,y1,x,y2,v);

function room(x1,y1,x2,y2,floorTile,doors=[]) {
  fill(floor,x1+1,y1+1,x2-1,y2-1,floorTile);
  lineH(walls,x1,x2,y1,T.WALL); lineH(walls,x1,x2,y2,T.WALL);
  lineV(walls,x1,y1,y2,T.WALL); lineV(walls,x2,y1,y2,T.WALL);
  for (const [x,y] of doors) { put(walls,x,y,0); put(floor,x,y,T.DOOR); }
}

// prédio e circulação base
fill(floor,1,1,W-2,H-2,T.WOOD);
lineH(walls,0,W-1,0,T.WALL); lineH(walls,0,W-1,H-1,T.WALL);
lineV(walls,0,0,H-1,T.WALL); lineV(walls,W-1,0,H-1,T.WALL);

// Topo executivo/produtivo
room(1,1,12,9,T.STONE,[[6,9]]);       // CEO
room(14,1,25,9,T.STONE,[[19,9]]);     // Diretor audiovisual
room(27,1,46,9,T.DARK,[[36,9]]);      // Produção

// Meio: recepção, convivência e privativas
room(1,11,13,22,T.LIGHT,[[13,16]]);   // recepção
room(15,11,31,22,T.PRIVATE,[[23,11],[23,22]]); // convivência
room(33,11,39,16,T.STONE,[[33,13]]);  // priv 1
room(40,11,46,16,T.STONE,[[40,13]]);  // priv 2
room(33,17,39,22,T.STONE,[[33,20]]);  // priv 3
room(40,17,46,22,T.STONE,[[40,20]]);  // priv 4

// Auditório inferior; porta apenas pelo corredor interno na borda superior
room(14,24,46,32,T.DARK,[[29,24],[30,24]]);

// corredores
fill(floor,1,10,46,10,T.WOOD);
fill(floor,13,11,14,23,T.WOOD);
fill(floor,31,11,32,23,T.WOOD);
fill(floor,14,23,46,23,T.WOOD);

// CEO premium
fill(floor,3,3,10,7,T.RUG);
put(decor,5,4,T.DESK); put(decor,6,4,T.CHAIR); put(decor,3,6,T.SOFA); put(decor,10,6,T.SIDE);
put(decor,2,2,T.BOOK); put(decor,11,2,T.PLANT); put(decor,2,8,T.PLANT); put(decor,8,2,T.SCREEN); put(decor,2,3,T.PLAQUE);

// Diretor audiovisual
put(decor,18,4,T.DESK); put(decor,19,4,T.CHAIR); put(decor,22,4,T.SCREEN); put(decor,15,2,T.BOOK);
put(decor,24,2,T.PLANT); put(decor,15,8,T.PLANT); put(decor,16,3,T.PLAQUE); put(decor,22,7,T.SOFA);

// Produção - 3 estações completas e divisórias
for (const x of [30,35,40]) { put(decor,x,4,T.DESK); put(decor,x,5,T.CHAIR); }
put(decor,31,7,T.DIVIDER); put(decor,36,7,T.DIVIDER); put(decor,41,7,T.DIVIDER);
put(decor,28,2,T.PLAQUE); put(decor,45,2,T.PLANT); put(decor,28,8,T.PLANT); put(decor,44,7,T.COFFEE);

// Recepção completa
fill(floor,3,13,11,20,T.RUG);
put(decor,5,16,T.RECEPTION); put(decor,9,16,T.RECEPTION); put(decor,4,19,T.SOFA); put(decor,9,19,T.LOUNGE);
put(decor,2,12,T.BOOK); put(decor,12,12,T.PLANT); put(decor,2,21,T.PLANT); put(decor,11,21,T.SIDE); put(decor,2,14,T.PLAQUE);

// Convivência central
put(decor,23,15,T.ROUND); put(decor,21,15,T.LOUNGE); put(decor,25,15,T.LOUNGE); put(decor,23,13,T.LOUNGE); put(decor,23,17,T.LOUNGE);
put(decor,17,13,T.SOFA); put(decor,28,13,T.COFFEE); put(decor,17,20,T.PLANT); put(decor,29,20,T.PLANT); put(decor,16,12,T.PLAQUE);

// Privativas mobiliadas
for (const [x,y] of [[35,13],[42,13],[35,20],[42,20]]) { put(decor,x,y,T.DESK); put(decor,x+1,y,T.CHAIR); }
for (const [x,y] of [[34,12],[45,12],[34,21],[45,21]]) put(decor,x,y,T.PLANT);
for (const [x,y] of [[34,14],[41,14],[34,18],[41,18]]) put(decor,x,y,T.PLAQUE);

// Auditório: palco, tela e fileiras de cadeiras
for (let x=20;x<=40;x++) put(decor,x,26,T.STAGE);
put(decor,29,25,T.SCREEN); put(decor,30,25,T.SCREEN);
for (const y of [28,30]) for (const x of [18,21,24,27,30,33,36,39,42]) put(decor,x,y,T.CHAIR);
put(decor,15,25,T.PLAQUE); put(decor,45,25,T.PLANT); put(decor,15,31,T.PLANT); put(decor,45,31,T.PLANT);

// decoração de corredor
for (const p of [[5,10],[19,10],[31,10],[43,10],[14,14],[14,20],[32,14],[32,20],[18,23],[42,23]]) put(decor,p[0],p[1],T.PLANT);

// spawn na recepção
for (const p of [[7,20],[8,20],[9,20],[7,21],[8,21],[9,21]]) put(start,p[0],p[1],T.LIGHT);

let id = 1;
const tileLayer = (name,data) => ({ id:id++, name, type:'tilelayer', width:W, height:H, x:0, y:0, opacity:1, visible:true, data });

const map = {
  compressionlevel:-1, height:H, infinite:false,
  layers:[
    tileLayer('VR_FLOOR',floor),
    {id:id++,name:'floorLayer',type:'objectgroup',draworder:'topdown',opacity:1,visible:true,x:0,y:0,objects:[]},
    tileLayer('VR_WALLS',walls),
    tileLayer('VR_FURNITURE',decor),
    tileLayer('start',start)
  ],
  nextlayerid:id, nextobjectid:1, orientation:'orthogonal', renderorder:'right-down',
  tiledversion:'1.11.2', tileheight:TH, tilewidth:TW, type:'map', version:'1.10', width:W,
  backgroundcolor:'#0d1117',
  tilesets:[{
    firstgid:1, columns:24, image:'vr-office-v3-tiles.svg', imageheight:32, imagewidth:768,
    margin:0, name:'VR Office V3 Premium Tiles', spacing:0, tilecount:24, tileheight:32, tilewidth:32,
    tiles:[
      {id:0,properties:[{name:'collides',type:'bool',value:true}]},
      {id:6,properties:[{name:'collides',type:'bool',value:true}]},
      {id:8,properties:[{name:'collides',type:'bool',value:true}]},
      {id:9,properties:[{name:'collides',type:'bool',value:true}]},
      {id:11,properties:[{name:'collides',type:'bool',value:true}]},
      {id:12,properties:[{name:'collides',type:'bool',value:true}]},
      {id:13,properties:[{name:'collides',type:'bool',value:true}]},
      {id:15,properties:[{name:'collides',type:'bool',value:true}]},
      {id:19,properties:[{name:'collides',type:'bool',value:true}]},
      {id:21,properties:[{name:'collides',type:'bool',value:true}]},
      {id:23,properties:[{name:'collides',type:'bool',value:true}]}
    ]
  }],
  properties:[
    {name:'mapName',type:'string',value:'Escritório Virtual VR — V3 Premium'},
    {name:'mapDescription',type:'string',value:'V3 visual premium: CEO, Diretor Audiovisual, Produção 3 estações, Recepção, Convivência, 4 Privativas e Auditório.'},
    {name:'vrVersion',type:'string',value:'V3-PREMIUM-JOGAVEL'}
  ]
};

fs.copyFileSync(tilesSource, tilesTarget);
fs.writeFileSync(output, JSON.stringify(map,null,2)+'\n');
console.log('V3 PREMIUM gerada com sucesso:');
console.log(output);
console.log('Mapa independente do office.tmj: SIM');
console.log('Recepção premium: SIM');
console.log('CEO executivo: SIM');
console.log('Diretor audiovisual distinto: SIM');
console.log('Produção com 3 estações: SIM');
console.log('Convivência central: SIM');
console.log('4 privativas mobiliadas: SIM');
console.log('Auditório com palco e fileiras: SIM');
console.log('Acesso do auditório pelo corredor interno: SIM');
console.log('Colisões principais: SIM');
