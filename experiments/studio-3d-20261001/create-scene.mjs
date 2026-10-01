// Initial design generator. Run deliberately to recreate the original scene.json.
import {writeFile} from 'node:fs/promises';
const objects=[];
function group(id,label,position=[0,0,0],extra={}) {const g={id,label,type:'group',position,children:[],...extra};objects.push(g);return g;}
function box(g,id,position,size,material,bevel=0){g.children.push({id,type:'box',position,size,material,bevel});}
function cyl(g,id,position,radius,height,material,rotation=[0,0,0],top=radius){g.children.push({id,type:'cylinder',position,radius,height,radiusTop:top,rotation,material});}
function tube(g,id,points,radius,material){g.children.push({id,type:'tube',points,radius,material});}
function text(g,id,value,position,size,material){g.children.push({id,type:'text',text:value,position,size,material});}
const shell=group('room_studio_a','スタジオ');
box(shell,'floor',[0,-.09,0],[6.2,.18,5.2],'floor');
for(let i=0;i<20;i++)box(shell,'floor_joint_'+i,[-2.9+i*.3,.001,0],[.008,.002,5],'joint');
box(shell,'rug',[0,.012,-.4],[3.75,.025,2.8],'rug',.025);
box(shell,'wall_west',[-3.08,1.5,0],[.16,3,5.2],'navy');
box(shell,'wall_east',[3.08,1.5,0],[.16,3,5.2],'navy');
// Real opening in the back wall. Glass and city sit behind it.
box(shell,'wall_back_base',[0,.48,-2.58],[6.2,.96,.16],'navy');
box(shell,'wall_back_top',[0,2.83,-2.58],[6.2,.34,.16],'navy');
box(shell,'wall_back_left',[-2.75,1.81,-2.58],[.7,1.7,.16],'navy');
box(shell,'wall_back_right',[1.77,1.81,-2.58],[2.66,1.7,.16],'navy');
for(const x of [-2.36,.44])box(shell,'window_side_'+x,[x,1.79,-2.5],[.055,1.74,.11],'metal');
for(const y of [.93,2.65])box(shell,'window_frame_'+y,[-.96,y,-2.5],[2.84,.055,.11],'metal');
box(shell,'window_mullion',[-.96,1.79,-2.5],[.03,1.72,.11],'metal');
box(shell,'window_glass',[-.96,1.79,-2.56],[2.74,1.66,.016],'glass');
box(shell,'window_sill',[-.96,.92,-2.45],[2.98,.08,.32],'oak',.015);
box(shell,'night_sky',[-.96,1.81,-3.7],[3.35,2.15,.02],'sky');
for(let i=0;i<12;i++){
  const h=.23+((i*7)%11)*.065, x=-2.35+i*.25;
  box(shell,'city_'+i,[x,1.02+h/2,-3.2],[.20,h,.14],'city');
  for(let j=0;j<3;j++)box(shell,'city_window_'+i+'_'+j,[x,1.12+j*.14,-3.115],[.025,.042,.005],'cityGlow');
}
// Slats occupy one accent zone, not every wall.
for(let i=0;i<20;i++)box(shell,'slat_'+i,[.76+i*.103,1.59,-2.43],[.04,2.5,.065],i%3?'oakDark':'oak');
text(shell,'station_sign','AI TSUYAKU / RADIO',[1.71,2.18,-2.385],[1.67,.18],'ivory');
for(const x of [-3.0,3.0]){
  for(let i=0;i<3;i++)box(shell,'acoustic_'+x+'_'+i,[x,1.8,-1.5+i*1.02],[.07,1.45,.66],'fabric',.015);
  box(shell,'oak_rail_'+x,[x,1.05,0],[.09,.055,5.0],'oak');
  box(shell,'skirting_'+x,[x,.12,0],[.09,.18,5.0],'metal');
}
box(shell,'back_skirting',[0,.12,-2.46],[6,.18,.09],'metal');
const portal=group('portal_studio_entry','入口', [0,0,0],{cutaway:true});
for(const x of [-1.96,1.96])box(portal,'wall_front_'+x,[x,1.5,2.58],[2.32,3,.16],'navy');
box(portal,'entry_lintel',[0,2.72,2.58],[1.60,.56,.16],'navy');
for(const x of [-.84,.84])box(portal,'door_jamb_'+x,[x,1.23,2.55],[.095,2.46,.24],'oakDark');
box(portal,'door_head',[0,2.48,2.55],[1.77,.08,.24],'oakDark');
box(portal,'on_air_housing',[0,2.69,2.72],[.58,.15,.065],'metal',.01);
text(portal,'on_air_text','ON AIR',[0,2.69,2.76],[.49,.11],'amber');
// Door held open to the side of the approach path.
box(portal,'open_door',[-1.20,1.2,2.97],[.08,2.35,1.45],'oakDark',.015);
const corridor=group('room_corridor_01','短い廊下',[0,0,0],{cutaway:true});
box(corridor,'corridor_floor',[0,-.065,4.25],[1.95,.13,3.30],'floor');
for(const x of [-1.02,1.02])box(corridor,'corridor_wall_'+x,[x,1.5,4.25],[.16,3,3.4],'navy');
box(corridor,'corridor_runner',[0,.008,4.25],[1.50,.012,3.1],'rug');
for(const z of [3.45,4.80])box(corridor,'corridor_fixture_'+z,[0,2.96,z],[.6,.035,.15],'amber');
const desk=group('prop_desk','木のテーブル',[0,0,-.45],{editable:true});
box(desk,'desktop',[0,.77,0],[2.60,.09,1.12],'oak',.025);
for(const x of [-1.03,1.03]){
  box(desk,'desk_leg_'+x,[x,.36,0],[.075,.72,.62],'metal',.008);
  box(desk,'desk_foot_'+x,[x,.035,0],[.26,.06,.74],'metal',.01);
}
box(desk,'desk_front_panel',[0,.53,.34],[1.96,.33,.04],'oakDark',.01);
const chair=group('prop_chair','ホストの椅子',[0,0,-1.50],{editable:true});
box(chair,'chair_seat',[0,.49,0],[.58,.10,.57],'fabric',.035);
box(chair,'chair_back',[0,.96,-.23],[.57,.73,.1],'fabric',.04);
cyl(chair,'chair_stem',[0,.25,0],.04,.45,'metal');
for(let i=0;i<5;i++){
  const a=i*Math.PI*2/5;
  tube(chair,'chair_base_'+i,[[0,.075,0],[Math.sin(a)*.31,.075,Math.cos(a)*.31]],.025,'metal');
  cyl(chair,'chair_wheel_'+i,[Math.sin(a)*.32,.04,Math.cos(a)*.32],.04,.035,'metal',[0,0,Math.PI/2]);
}
const mic=group('prop_microphone','マイクとアーム',[-.66,0,-.43],{editable:true});
cyl(mic,'mic_clamp',[-.40,.85,-.23],.045,.1,'metal');
tube(mic,'arm_lower',[[-.40,.85,-.23],[-.38,1.2,-.35]],.018,'metal');
tube(mic,'arm_upper',[[-.38,1.2,-.35],[0,1.36,-.06]],.018,'metal');
cyl(mic,'arm_joint',[-.38,1.2,-.35],.04,.05,'metal',[Math.PI/2,0,0]);
cyl(mic,'mic_body',[0,1.30,0],.065,.25,'gold');
cyl(mic,'mic_grille',[0,1.46,0],.07,.085,'goldMesh');
cyl(mic,'mic_bottom',[0,1.16,0],.044,.04,'metal');
for(let i=0;i<8;i++){
  const a=i*Math.PI*2/8; tube(mic,'shock_'+i,[[Math.sin(a)*.087,1.2,Math.cos(a)*.087],[Math.sin(a)*.087,1.37,Math.cos(a)*.087]],.004,'metal');
}
mic.children.push({id:'pop_filter',type:'cylinder',position:[0,1.36,.17],radius:.115,height:.014,material:'pop',rotation:[Math.PI/2,0,0]});
tube(mic,'pop_stem',[[.12,1.19,0],[.16,1.22,.15],[0,1.25,.17]],.006,'metal');
tube(mic,'cable',[[0,1.15,0],[-.03,1.00,-.08],[-.27,.87,-.15],[-.35,.82,-.18]],.009,'rubber');
const laptop=group('prop_laptop','PC',[.66,0,-.5],{editable:true});
box(laptop,'laptop_base',[0,.825,.07],[.58,.025,.38],'metal',.012);
box(laptop,'laptop_lid',[0,1.04,-.095],[.58,.39,.024],'metal',.01);
box(laptop,'laptop_display',[0,1.04,-.078],[.51,.31,.007],'screen');
for(let i=0;i<4;i++)box(laptop,'screen_line_'+i,[-.07,1.11-i*.043,-.072],[.22+i*.03,.012,.004],'screenText');
for(let i=0;i<4;i++)box(laptop,'key_row_'+i,[0,.841,-.01+i*.047],[.44,.003,.027],'rubber');
const props=group('prop_table_details','机上の小物',[0,0,-.45]);
cyl(props,'mug',[.22,.895,.24],.052,.15,'ivory');
cyl(props,'coffee',[.22,.973,.24],.042,.003,'coffee');
props.children.push({id:'mug_handle',type:'torus',position:[.285,.9,.24],radius:.034,tube:.007,material:'ivory',rotation:[0,Math.PI/2,0]});
box(props,'notebook',[.58,.831,.30],[.32,.02,.22],'ivory',.008);
box(props,'notebook_spine',[.43,.846,.3],[.008,.006,.21],'navy');
box(props,'mixer',[-.99,.845,.29],[.27,.052,.22],'metal',.01);
for(let i=0;i<4;i++)cyl(props,'mixer_knob_'+i,[-1.08+i*.06,.88,.27],.011,.02,i===0?'amber':'ivory');
const lamp=group('prop_lamp','フロアランプ',[2.35,0,-1.76],{editable:true});
cyl(lamp,'lamp_base',[0,.035,0],.20,.06,'metal');
cyl(lamp,'lamp_stem',[0,.81,0],.014,1.55,'gold');
cyl(lamp,'lamp_shade',[0,1.70,0],.25,.30,'shade',[0,0,0],.17);
cyl(lamp,'lamp_glow',[0,1.55,0],.20,.008,'amber');
const shelf=group('prop_shelf','低い棚',[-2.20,0,-1.90]);
box(shelf,'shelf_top',[0,.69,0],[.92,.045,.37],'oak',.01);
box(shelf,'shelf_bottom',[0,.15,0],[.92,.045,.37],'oak',.01);
for(const x of [-.43,.43])box(shelf,'shelf_side_'+x,[x,.41,0],[.04,.51,.37],'oakDark');
for(let i=0;i<8;i++)box(shelf,'book_'+i,[-.32+i*.075,.40,0],[.045,.44-(i%3)*.035,.24],i%3===0?'ivory':i%3===1?'fabric':'oakDark');
const data={version:1,title:'AI通訳ラジオ / Studio A',units:'meters',up:'Y',room:{width:6,depth:5,height:3},objects,
  anchors:[{id:'anchor_cat_chair',position:[0,1.15,-1.5]},{id:'anchor_cat_table',position:[.17,.86,-.65]},{id:'anchor_portal_entry',position:[0,0,2.5]}],
  lights:[{id:'light_ambient',type:'hemisphere',color:'#c4d9e9',groundColor:'#50402e',intensity:1.9},{id:'light_key',type:'directional',color:'#ffe1b2',intensity:3.7,position:[-1.5,4,2.3],target:[0,.7,-.6],shadow:true},{id:'light_window',type:'point',color:'#8cbdea',intensity:20,position:[-1.05,2.1,-2.05],distance:7},{id:'light_lamp',type:'point',color:'#ffb55b',intensity:13,position:[2.35,1.6,-1.76],distance:4},{id:'light_corridor',type:'point',color:'#ffd399',intensity:10,position:[0,2.6,4.2],distance:4}],
  cameras:[{id:'front',label:'正面',position:[.1,1.55,2.08],target:[0,1.16,-.9],fov:46},{id:'angle',label:'斜め',position:[2.30,1.52,1.48],target:[-.15,1.08,-.9],fov:48},{id:'entry',label:'入口',position:[0,1.60,4.88],target:[0,1.22,-.85],fov:52},{id:'overview',label:'全体を見る',position:[7.4,6.6,9],target:[0,.7,.15],fov:43,cutaway:true}],
  tour:{duration:9,from:[0,1.6,5.15],to:[.12,1.55,1.8],target:[0,1.15,-.9]},
  materialPresets:'./materials.json',cost:{higgsfieldGenerations:0,higgsfieldCredits:0}};
const materials={navy:{color:'#081B2A',roughness:.92},fabric:{color:'#16324F',roughness:.97},floor:{color:'#66523b',roughness:.88},joint:{color:'#392e22',roughness:1},rug:{color:'#14232d',roughness:1},oak:{color:'#b88b56',roughness:.7},oakDark:{color:'#80613d',roughness:.78},metal:{color:'#283139',roughness:.36,metalness:.65},rubber:{color:'#101820',roughness:.9},gold:{color:'#bb9351',roughness:.34,metalness:.75},goldMesh:{color:'#a89973',roughness:.66,metalness:.5},pop:{color:'#121e27',roughness:1},ivory:{color:'#e4dfd0',roughness:.75},coffee:{color:'#231812',roughness:.4},glass:{color:'#93bbca',roughness:.15,transparent:true,opacity:.14,depthWrite:false},amber:{color:'#f9a135',emissive:'#f9a135',emissiveIntensity:2.1,roughness:.65},shade:{color:'#d7b780',emissive:'#a35b1e',emissiveIntensity:.25,roughness:1},sky:{color:'#203c57',emissive:'#203c57',emissiveIntensity:.6,roughness:1},city:{color:'#102237',roughness:1},cityGlow:{color:'#f0c481',emissive:'#f0c481',emissiveIntensity:.8},screen:{color:'#173d53',emissive:'#173d53',emissiveIntensity:.7},screenText:{color:'#91aab5',emissive:'#91aab5',emissiveIntensity:.4}};
await writeFile(new URL('scene.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
await writeFile(new URL('materials.json',import.meta.url),JSON.stringify(materials,null,2)+'\n');
console.log('Original scene.json and materials.json created');
