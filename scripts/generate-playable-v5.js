#!/usr/bin/env node
const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const starter=path.join(root,'maps','starter-kit');
const out=path.join(starter,'vr-office-v5.tmj');const src=path.join(root,'assets','maps','vr-office-v5-tiles.svg');const dst=path.join(starter,'vr-office-v5-tiles.svg');
if(!fs.existsSync(starter)){console.error('Starter kit não encontrado.');process.exit(1)}if(!fs.existsSync(src)){console.error('Tiles V5 não encontrados.');process.exit(1)}
const W=52,H=36,TW=32,TH=32,N=W*H;
const T={WALL:1,WOOD:2,STONE:3,DARK:4,CARPET:5,GLASS:6,DOOR:7,DESK:8,CHAIR:9,SOFA:10,PLANT:11,SCREEN:12,WORK:13,RACK:14,LED:15,ROUND:16,COFFEE:17,FRIDGE:18,AUDCHAIR:19,STAGE:20,RECEP:21,RUG:22,BOOK:23,GOLD:24,LOUNGE:25,ACOUSTIC:26,SPEAKER:27,CONSOLE:28,SIDE:29,LIGHT:30,SIGN:31};
const floor=Array(N).fill(0),walls=Array(N).fill(0),decor=Array(N).fill(0),start=Array(N).fill(0);
const i=(x,y)=>y*W+x;const put=(a,x,y,v)=>{if(x>=0&&y>=0&&x<W&&y<H)a[i(x,y)]=v};const fill=(a,x1,y1,x2,y2,v)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)put(a,x,y,v)};const h=(a,x1,x2,y,v)=>fill(a,x1,y,x2,y,v);const v=(a,x,y1,y2,t)=>fill(a,x,y1,x,y2,t);
function room(x1,y1,x2,y2,ft,doors=[]){fill(floor,x1+1,y1+1,x2-1,y2-1,ft);h(walls,x1,x2,y1,T.WALL);h(walls,x1,x2,y2,T.WALL);v(walls,x1,y1,y2,T.WALL);v(walls,x2,y1,y2,T.WALL);for(const [x,y] of doors){put(walls,x,y,0);put(floor,x,y,T.DOOR)}}
fill(floor,1,1,W-2,H-2,T.STONE);h(walls,0,W-1,0,T.WALL);h(walls,0,W-1,H-1,T.WALL);v(walls,0,0,H-1,T.WALL);v(walls,W-1,0,H-1,T.WALL);
// top row
room(1,1,13,10,T.WOOD,[[7,10]]); // CEO
room(14,1,26,10,T.DARK,[[20,10]]); // audiovisual director tech
room(27,1,39,10,T.STONE,[[33,10]]); // production 4 desks
room(40,1,45,10,T.WOOD,[[42,10]]); // private1
room(46,1,50,10,T.WOOD,[[48,10]]); // private2
// center / right
room(14,12,28,20,T.WOOD,[[20,12]]); // rest room
room(40,12,45,20,T.WOOD,[[40,15]]); // private3
room(46,12,50,20,T.WOOD,[[46,15]]); // private4
// reception left and auditorium bottom
room(1,12,12,25,T.STONE,[[12,18]]);
room(13,22,39,34,T.CARPET,[[25,22],[26,22]]);
// circulation
fill(floor,1,11,50,11,T.STONE);fill(floor,12,12,13,25,T.STONE);fill(floor,29,12,39,21,T.STONE);fill(floor,39,11,39,21,T.STONE);fill(floor,13,21,50,21,T.STONE);
// glass accents front-facing
for(const x of [2,3,4,5,9,10,11,12,15,16,17,18,22,23,24,25,28,29,30,31,35,36,37,38]) put(decor,x,10,T.GLASS);
// CEO premium
fill(floor,3,3,11,8,T.RUG);put(decor,5,4,T.DESK);put(decor,6,5,T.CHAIR);put(decor,3,7,T.SOFA);put(decor,10,7,T.SIDE);put(decor,2,2,T.BOOK);put(decor,11,2,T.PLANT);put(decor,2,9,T.PLANT);put(decor,7,2,T.SCREEN);put(decor,4,2,T.GOLD);
// audiovisual director technological room
fill(floor,15,2,25,9,T.DARK);for(const x of [15,25]){put(decor,x,2,T.RACK);put(decor,x,8,T.SPEAKER)}
for(const x of [16,17,18,19,21,22,23,24]) put(decor,x,1,T.LED);put(decor,18,3,T.SCREEN);put(decor,20,3,T.SCREEN);put(decor,22,3,T.SCREEN);put(decor,20,5,T.CONSOLE);put(decor,20,6,T.CHAIR);put(decor,17,8,T.SOFA);put(decor,24,8,T.PLANT);put(decor,16,4,T.ACOUSTIC);put(decor,24,4,T.ACOUSTIC);
// production exactly 4 desks + computers
for(const [x,y] of [[29,3],[35,3],[29,7],[35,7]]){put(decor,x,y,T.WORK);put(decor,x,y+1,T.CHAIR)}put(decor,28,2,T.PLANT);put(decor,38,2,T.PLANT);put(decor,38,8,T.COFFEE);
// four privates, standardized
for(const [x,y] of [[42,4],[48,4],[42,15],[48,15]]){put(decor,x,y,T.DESK);put(decor,x,y+1,T.CHAIR);put(decor,x+2,y+3,T.SOFA);put(decor,x-1,y-2,T.PLANT)}
// rest room
fill(floor,16,14,26,18,T.RUG);put(decor,18,15,T.SOFA);put(decor,22,15,T.SOFA);put(decor,20,16,T.ROUND);put(decor,16,13,T.COFFEE);put(decor,25,13,T.FRIDGE);put(decor,16,19,T.PLANT);put(decor,26,19,T.PLANT);put(decor,21,13,T.SIGN);
// reception
put(decor,4,16,T.RECEP);put(decor,7,16,T.RECEP);put(decor,3,21,T.SOFA);put(decor,8,21,T.SOFA);put(decor,2,13,T.PLANT);put(decor,11,13,T.PLANT);put(decor,2,24,T.PLANT);put(decor,10,24,T.SIGN);
// auditorium
for(let x=18;x<=34;x++)put(decor,x,24,T.STAGE);put(decor,24,23,T.SCREEN);put(decor,25,23,T.SCREEN);put(decor,37,24,T.SPEAKER);put(decor,15,24,T.SPEAKER);
for(const y of [27,29,31,33])for(const x of [16,19,22,25,28,31,34,37])put(decor,x,y,T.AUDCHAIR);
// corridor decor
for(const [x,y] of [[5,11],[16,11],[28,11],[39,11],[49,11],[13,15],[13,21],[30,15],[38,15],[42,21],[49,21]])put(decor,x,y,T.PLANT);
// spawn in reception
for(const [x,y] of [[5,23],[6,23],[5,24],[6,24]])put(start,x,y,T.STONE);
let id=1;const layer=(name,data)=>({id:id++,name,type:'tilelayer',width:W,height:H,x:0,y:0,opacity:1,visible:true,data});
const map={compressionlevel:-1,height:H,infinite:false,layers:[layer('VR_FLOOR',floor),{id:id++,name:'floorLayer',type:'objectgroup',draworder:'topdown',opacity:1,visible:true,x:0,y:0,objects:[]},layer('VR_WALLS',walls),layer('VR_FURNITURE',decor),layer('start',start)],nextlayerid:id,nextobjectid:1,orientation:'orthogonal',renderorder:'right-down',tiledversion:'1.11.2',tileheight:TH,tilewidth:TW,type:'map',version:'1.10',width:W,backgroundcolor:'#0b1016',tilesets:[{firstgid:1,columns:32,image:'vr-office-v5-tiles.svg',imageheight:32,imagewidth:1024,margin:0,name:'VR Office V5 Premium',spacing:0,tilecount:32,tileheight:32,tilewidth:32,tiles:[0,7,8,9,10,11,12,13,16,17,18,19,20,22,24,25,26,27,28].map(id=>({id,properties:[{name:'collides',type:'bool',value:true}]}))}],properties:[{name:'mapName',type:'string',value:'Escritório Virtual VR — V5 Planta Premium Final'},{name:'mapDescription',type:'string',value:'CEO, Diretor Audiovisual tecnológico, Produção 4 mesas, 4 Privativas, Sala de Descanso, Recepção e Auditório.'},{name:'vrVersion',type:'string',value:'V5-PLANTA-PREMIUM-FINAL'}]};
fs.copyFileSync(src,dst);fs.writeFileSync(out,JSON.stringify(map,null,2)+'\n');
console.log('V5 PREMIUM FINAL gerada com sucesso:');console.log(out);console.log('CEO: SIM');console.log('Diretor Audiovisual tecnológico: SIM');console.log('Produção com 4 mesas/computadores: SIM');console.log('4 Privativas: SIM');console.log('Sala de Descanso: SIM');console.log('Recepção: SIM');console.log('Auditório geral: SIM');console.log('Mapa independente das versões anteriores: SIM');
