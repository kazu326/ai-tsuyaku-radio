"""Coordinate-driven A3 headquarters concept plans: PDF, SVG, PNG and Blender-ready JSON."""
import base64
import hashlib
import html
import json
import math
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from PIL import Image
import pypdfium2 as pdfium

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[1]
reference_paths = [ROOT/'video/assets/higgsfield-studio-library-20260930'/f for f in ['09-headquarters-exterior.png','07-headquarters-corridor.png']]
source_before = {str(p): (p.stat().st_size, p.stat().st_mtime_ns) for p in reference_paths}
for name, file in [('Plan', 'C:/Windows/Fonts/meiryo.ttc'), ('Yomogi', OUT/'fonts/Yomogi-Regular.ttf'), ('Klee', OUT/'fonts/KleeOne-Regular.ttf'), ('Zen', OUT/'fonts/ZenKurenaido-Regular.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(file)))
INK, MUTED, PAPER = '#203441', '#69767c', '#fcfbf7'
WALL, BLUE, GOLD, TEAL = '#35434b', '#e4edf2', '#e7d9bc', '#dce8e3'
NOTE_COLORS = ['#a65b35', '#287c7b', '#796293']

def room(id, name, rect, kind='normal'):
    return {'id': id, 'name': name, 'rect': rect, 'kind': kind, 'net_area_m2': round(rect[2]*rect[3], 4)}
def portal(id, a, b, orientation, center, width, swing=1, provisional=False):
    return {'id': id, 'connects': [a,b], 'orientation': orientation, 'center': center, 'clear_width_m': width, 'swing': swing, 'provisional': provisional}
stairs_rect = [12.12, 6.32, 3.68, 5.08]
floors = [
 {'id':'1F', 'level_z_m':0, 'title':'来客を迎える、メイン収録フロア',
  'rooms':[
   room('store1','機材保管',[.2,.2,2.28,3.2]), room('wc1','WC',[.2,3.52,2.28,3.08]),
   room('services1','設備庫',[.2,6.72,2.28,1.4]), room('hall1','主通路',[2.6,.2,1.8,7.92],'circulation'),
   room('recordA','録音室 A',[4.52,.2,6.4,3.0],'user_record'), room('controlA','コントロール A',[4.52,3.32,6.4,2.88],'user_control'),
   room('lobby','受付・待合',[11.04,.2,4.76,6.0]), room('cross1','連絡通路',[4.52,6.32,7.46,1.8],'circulation'),
   room('tech1','編集・技術室',[.2,8.24,4.2,3.16]), room('equipment1','資料・機材室',[4.52,8.24,7.46,3.16]),
   room('stairs1','階段',stairs_rect,'stairs')],
  'portals':[
   portal('main','outside','lobby','h',[14.0,.1],2.1,1),
   portal('p-store1','hall1','store1','v',[2.54,1.5],.9,-1), portal('p-wc1','hall1','wc1','v',[2.54,4.5],.9,-1),
   portal('p-services1','hall1','services1','v',[2.54,7.5],.7,-1),
   portal('p-halls1','hall1','cross1','v',[4.46,7.22],1.8,0),
   portal('p-lobby','lobby','cross1','h',[11.5,6.26],.9,-1),
   portal('p-stairs1','cross1','stairs1','v',[12.05,7.02],1.1,1),
   portal('p-tech1','hall1','tech1','h',[3.45,8.18],1.0,1),
   portal('p-equipment1','cross1','equipment1','h',[8.1,8.18],1.2,1),
   portal('p-controlA','hall1','controlA','v',[4.46,4.5],1.0,1,True),
   portal('p-recordA','controlA','recordA','h',[6.0,3.26],1.0,-1,True),
   portal('rear1','equipment1','outside','h',[10.5,11.5],1.0,-1)],
  'windows':[
   {'id':'front-store','orientation':'h','center':[1.35,.1],'width':1.65},
   {'id':'front-studio','orientation':'h','center':[7.7,.1],'width':5.5,'provisional_interface':True},
   {'id':'front-lobby-left','orientation':'h','center':[12.13,.1],'width':1.42},
   {'id':'front-lobby-right','orientation':'h','center':[15.38,.1],'width':.56},
   {'id':'east-lobby','orientation':'v','center':[15.9,3.2],'width':3.8},
   {'id':'north-tech','orientation':'h','center':[2.2,11.5],'width':2.2},
   {'id':'north-equipment','orientation':'h','center':[7.7,11.5],'width':2.4}],
  'route':[[14,-.6],[14,4.6],[11.5,4.6],[11.5,7.22],[3.5,7.22],[3.5,4.5],[5.25,4.5],[6,4.5],[6,1.9]]},
 {'id':'2F', 'level_z_m':3.4, 'title':'つくる、話す、もう一つの収録フロア',
  'rooms':[
   room('work2','編集・制作室',[.2,.2,5.0,6.0]),
   room('recordB','録音室 B',[5.32,.2,5.4,3.0],'user_record'), room('controlB','コントロール B',[5.32,3.32,5.4,2.88],'user_control'),
   room('project2','企画・ワーク室',[10.84,.2,4.96,6.0]), room('cross2','共用通路',[.2,6.32,11.78,1.8],'circulation'),
   room('wc2','WC',[.2,8.24,2.28,3.16]), room('pantry2','休憩・給湯',[2.6,8.24,2.6,3.16]),
   room('meeting2','打合せ・資料室',[5.32,8.24,6.66,3.16]), room('stairs2','階段',stairs_rect,'stairs')],
  'portals':[
   portal('p-stairs2','stairs2','cross2','v',[12.05,7.02],1.1,1),
   portal('p-work2','cross2','work2','h',[3.4,6.26],1.0,-1),
   portal('p-project2','cross2','project2','h',[11.4,6.26],.95,-1),
   portal('p-wc2','cross2','wc2','h',[1.7,8.18],.9,1),
   portal('p-pantry2','cross2','pantry2','h',[3.7,8.18],.9,1),
   portal('p-meeting2','cross2','meeting2','h',[8.4,8.18],1.2,1),
   portal('p-controlB','cross2','controlB','h',[8.1,6.26],1.0,-1,True),
   portal('p-recordB','controlB','recordB','h',[6.7,3.26],1.0,-1,True)],
  'windows':[
   {'id':'front-west','orientation':'h','center':[2.7,.1],'width':4.2},
   {'id':'front-middle','orientation':'h','center':[8.0,.1],'width':4.8,'provisional_interface':True},
   {'id':'front-east','orientation':'h','center':[13.1,.1],'width':4.2},
   {'id':'east-project','orientation':'v','center':[15.9,3.3],'width':2.8},
   {'id':'north-pantry','orientation':'h','center':[3.8,11.5],'width':1.6},
   {'id':'north-meeting','orientation':'h','center':[8.6,11.5],'width':3.6}],
  'route':[[13.2,7.0],[11.3,7.0],[8.1,7.0],[8.1,4.8],[6.7,4.8],[6.7,1.9]]}
]

model = {
 'version':1, 'date_jst':'2026-10-01', 'status':'worldbuilding_layout_proposal',
 'building':{'width_m':16.0,'depth_m':11.6,'outer_wall_m':.2,'partition_m':.12,'floor_to_floor_m':3.4,'gross_floor_area_each_m2':185.6,'gross_total_m2':371.2},
 'coordinates':{'origin':'南西の外壁外面・1階床','units':'meters','x_positive':'東','y_positive':'北','z_positive':'上','plan_north':'図面上の便宜的な北。敷地の実方位は未設定。'},
 'references':[
  {'file':'video/assets/higgsfield-studio-library-20260930/09-headquarters-exterior.png','use':'2階建て、陸屋根、正面右の入口、1階の大きなガラス、2階の3つの窓区画を採用。寸法・奥行きは仮定。'},
  {'file':'video/assets/higgsfield-studio-library-20260930/07-headquarters-corridor.png','use':'通路の紺色の壁、木の床と枠、暖色照明のみ。直通扉・斜め扉・録音室の配置は採用しない。'}],
 'booth_boundary':{'owner':'user','furniture_included':False,'interior_layout_final':False,'interface_doors':'仮の接続口。扉の形式・正確な位置・遮音壁・観察窓はユーザーの詳細図に合わせて更新。','facade_glazing':'外観側の仮開口。録音室の内殻・遮音層・内窓は詳細図で調整。'},
 'design_basis':[{'url':'https://wsdg.com/projects-items/vienna-city-sound/','adopted':'大きな録音区画と小さな配信・収録区画を分ける考え方。寸法・間取りの転載ではない。'}, {'url':'https://wsdg.com/wp-content/uploads/250109-2025-WSDG-Company-Profile-General-LR.pdf','adopted':'Audibleの事例（p.103）にある収録・コントロール・待機・機材・設備などの機能分け。'}],
 'stairs':{'rect':stairs_rect,'floor_to_floor_m':3.4,'risers':20,'riser_m':.17,'tread_m':.27,'flight_clear_m':1.2,'landing_clear_m':1.2,'note':'両階の階段区画と踊り場位置を共通にした仮の折返し階段。'},
 'floors':floors,
 'non_goals':['ラジオブース内の机・マイク・PC・椅子の配置','ブース内の音響・遮音仕様の確定','画像からの実測復元','敷地境界・構造躯体・法規の設計'],
}
(OUT/'headquarters-layout.json').write_text(json.dumps(model,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

class Sheet:
 def __init__(self,c): self.c=c; self.parts=[]
 def color(self,hex): return tuple(int(hex[i:i+2],16)/255 for i in (1,3,5))
 def line(self,x1,y1,x2,y2,color=INK,width=.22,dash=None):
    self.c.setStrokeColorRGB(*self.color(color));self.c.setLineWidth(width*mm);self.c.setDash([v*mm for v in (dash or [])])
    self.c.line(x1*mm,(297-y1)*mm,x2*mm,(297-y2)*mm)
    self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"'+(f' stroke-dasharray="{" ".join(map(str,dash))}"' if dash else '')+'/>')
 def rect(self,x,y,w,h,fill=None,stroke=None,width=.2,dash=None):
    self.c.setLineWidth(width*mm);self.c.setDash([v*mm for v in (dash or [])])
    if fill:self.c.setFillColorRGB(*self.color(fill))
    if stroke:self.c.setStrokeColorRGB(*self.color(stroke))
    self.c.rect(x*mm,(297-y-h)*mm,w*mm,h*mm,fill=bool(fill),stroke=bool(stroke))
    self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}"'+(f' stroke-dasharray="{" ".join(map(str,dash))}"' if dash else '')+'/>')
 def text(self,x,y,txt,size=8,font='Plan',color=INK,anchor='start',rotation=0):
    self.c.saveState();self.c.setFillColorRGB(*self.color(color));self.c.setFont(font,size)
    self.c.translate(x*mm,(297-y)*mm);self.c.rotate(-rotation)
    if anchor=='middle':self.c.drawCentredString(0,0,txt)
    elif anchor=='end':self.c.drawRightString(0,0,txt)
    else:self.c.drawString(0,0,txt)
    self.c.restoreState()
    self.parts.append(f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size/2.834645669}" fill="{color}" text-anchor="{anchor}" transform="rotate({rotation} {x} {y})">{html.escape(txt)}</text>')
 def path(self,points,color=INK,width=.25,fill=None,dash=None):
    p=self.c.beginPath();p.moveTo(points[0][0]*mm,(297-points[0][1])*mm)
    svg=f'M {points[0][0]} {points[0][1]}'
    for command in points[1:]:
        if len(command)==2:p.lineTo(command[0]*mm,(297-command[1])*mm);svg+=f' L {command[0]} {command[1]}'
        elif len(command)==6:p.curveTo(command[0]*mm,(297-command[1])*mm,command[2]*mm,(297-command[3])*mm,command[4]*mm,(297-command[5])*mm);svg+=' C '+' '.join(map(str,command))
    self.c.setStrokeColorRGB(*self.color(color));self.c.setLineWidth(width*mm);self.c.setDash([v*mm for v in (dash or [])])
    if fill:self.c.setFillColorRGB(*self.color(fill))
    self.c.drawPath(p,stroke=1,fill=bool(fill))
    self.parts.append(f'<path d="{svg}" stroke="{color}" stroke-width="{width}" fill="{fill or "none"}"'+(f' stroke-dasharray="{" ".join(map(str,dash))}"' if dash else '')+'/>')
 def circle(self,x,y,r,stroke=INK,fill=None,width=.22):
    self.c.setStrokeColorRGB(*self.color(stroke));self.c.setLineWidth(width*mm);self.c.setDash([])
    if fill:self.c.setFillColorRGB(*self.color(fill))
    self.c.circle(x*mm,(297-y)*mm,r*mm,fill=bool(fill),stroke=True)
    self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill or "none"}" stroke="{stroke}" stroke-width="{width}"/>')
 def image(self,file,x,y,w,h):
    image = Image.open(file).convert('RGB')
    image.thumbnail((1600,900),Image.Resampling.LANCZOS)
    self.c.drawImage(ImageReader(image),x*mm,(297-y-h)*mm,width=w*mm,height=h*mm)
    # The third PDF page contains source images. SVG plan sheets do not.
 def svg(self,file):
    fonts=[]
    for name,f in [('Yomogi','Yomogi-Regular.ttf'),('Klee','KleeOne-Regular.ttf'),('Zen','ZenKurenaido-Regular.ttf')]:
        fonts.append('@font-face{font-family:'+name+';src:url(data:font/ttf;base64,'+base64.b64encode((OUT/'fonts'/f).read_bytes()).decode()+')}')
    fonts.append('text[font-family="Plan"]{font-family:Meiryo,"Yu Gothic",sans-serif}')
    file.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm" viewBox="0 0 420 297"><title>AI通訳ラジオ本社 全体平面図</title><style>'+''.join(fonts)+'</style>'+''.join(self.parts)+'</svg>',encoding='utf-8')

def dims(s,x,y,width,depth):
 # All dimension values use millimetres; drawing is true 1:100 on A3.
 for ys in [y-6]:
    s.line(x,ys,x+width,ys,MUTED,.16)
    for xx in [x,x+width]:s.line(xx,y-1,xx,ys-2,MUTED,.14);s.line(xx-1,ys+1,xx+1,ys-1,MUTED,.23)
    s.text(x+width/2,ys-1.4,'16,000',7.5,anchor='middle')
 s.line(x-6,y,x-6,y+depth,MUTED,.16)
 for yy in [y,y+depth]:s.line(x-1,yy,x-8,yy,MUTED,.14);s.line(x-7,yy+1,x-5,yy-1,MUTED,.23)
 s.text(x-8,y+depth/2,'11,600',7.5,anchor='middle',rotation=-90)
 for value in [0,4,8,12,16]:
    xx=x+value*10;s.circle(xx,y-12,1.8,MUTED,PAPER,.16);s.text(xx,y-11.15,str(value//4+1),6,anchor='middle')

def draw_floor(s,f,x,y):
 def p(xx,yy):return x+xx*10,y+(11.6-yy)*10
 s.text(x,y-24,f['id'],22)
 s.text(x+21,y-24,f['title'],9.2)
 s.rect(x,y,160,116,fill=WALL)
 for r in f['rooms']:
    rx,ry,rw,rh=r['rect'];px,py=p(rx,ry+rh)
    color = BLUE if r['kind'].startswith('user_') else '#f1eadd' if r['kind']=='circulation' else PAPER
    s.rect(px,py,rw*10,rh*10,fill=color)
    if r['kind'].startswith('user_'):
        s.rect(px+.7,py+.7,rw*10-1.4,rh*10-1.4,stroke='#8299a6',width=.15,dash=[2,1])
    cx,cy=p(rx+rw/2,ry+rh/2)
    if r['kind']=='stairs':continue
    if r['id']=='hall1':
        s.text(cx,cy-7,'主通路',7.2,anchor='middle');s.text(cx,cy-2,'幅 1,800',6.1,anchor='middle');continue
    s.text(cx,cy-.8,r['name'],8 if rw>3 else 7,anchor='middle')
    s.text(cx,cy+3.8,f"{r['net_area_m2']:.1f} m²",6.8,color=MUTED,anchor='middle')
    if r['kind'].startswith('user_'):s.text(cx,cy+8.4,'詳細：ユーザー作成',6.4,color='#637f8e',anchor='middle')
 # Door openings are cut into the wall layer. Studio doors are only provisional interfaces.
 for q in f['portals']:
    cx,cy=p(*q['center']);w=q['clear_width_m']*10;v=q['orientation']=='v'
    s.rect(cx-1.01 if v else cx-w/2,cy-w/2 if v else cy-1.01,2.02 if v else w,w if v else 2.02,fill=PAPER)
    if q['swing']==0:continue
    color='#879da7' if q['provisional'] else INK
    dash=[1.2,.8] if q['provisional'] else None
    if v:
        hinge=(cx,cy-w/2);end=(cx+q['swing']*w,cy-w/2)
        s.line(*hinge,*end,color,.18,dash)
        s.path([(cx,cy+w/2),(cx+q['swing']*w*.5523,cy+w/2,cx+q['swing']*w,cy-w/2+w*.5523,*end)],color,.14,dash=dash)
    else:
        # Double leaves for the front entrance, single-leaf elsewhere.
        if q['id']=='main':
            for sign in [-1,1]:
                hx=cx+sign*w/2;s.line(hx,cy,hx,cy-w/2,INK,.18)
                s.path([(cx,cy),(cx,cy-w*.276,hx-sign*w*.276,cy-w/2,hx,cy-w/2)],INK,.14)
        else:
            hinge=(cx-w/2,cy);end=(cx-w/2,cy-q['swing']*w)
            s.line(*hinge,*end,color,.18,dash)
            s.path([(cx+w/2,cy),(cx+w/2,cy-q['swing']*w*.5523,cx-w/2+w*.5523,cy-q['swing']*w,*end)],color,.14,dash=dash)
 for win in f['windows']:
    cx,cy=p(*win['center']);length=win['width']*10
    if win['orientation']=='h':
        s.rect(cx-length/2,cy-1,length,2,fill='#cee0e9')
        for offset in [-.65,0,.65]:s.line(cx-length/2,cy+offset,cx+length/2,cy+offset,'#5d879c',.13)
    else:
        s.rect(cx-1,cy-length/2,2,length,fill='#cee0e9')
        for offset in [-.65,0,.65]:s.line(cx+offset,cy-length/2,cx+offset,cy+length/2,'#5d879c',.13)
 # Corresponding dogleg staircase: 1.2 m flights, 0.27 m tread, 1.2 m landings.
 sx,sy,sw,sh=stairs_rect
 for fx in [sx+.3,sx+1.9]:
    a,b=p(fx,sy+3.63);s.rect(a,b,12,24.3,stroke=MUTED,width=.17)
    for i in range(1,9):
        aa,bb=p(fx,sy+1.2+i*.27);s.line(aa,bb,aa+12,bb,MUTED,.12)
 flight_center = sx+.9 if f['id']=='1F' else sx+2.5
 ax,ay=p(flight_center,sy+1.35);bx,by=p(flight_center,sy+3.45)
 s.line(ax,ay,bx,by,INK,.2);s.line(bx,by,bx-1,by+2,INK,.2);s.line(bx,by,bx+1,by+2,INK,.2)
 s.text(*p(sx+2.85,sy+4.1),'UP' if f['id']=='1F' else 'DN',7,anchor='middle')
 s.text(*p(sx+sw/2,sy+.43),'階段／上下階同位置',6.0,anchor='middle')
 # Furniture only outside the user-owned studio zones.
 if f['id']=='1F':
    a,b=p(13.0,4.9);s.rect(a,b,17,7,stroke=MUTED,width=.18);s.text(a+8.5,b+4.5,'受付',5.5,anchor='middle')
    for yy in [1.7,2.4]:a,b=p(15.15,yy);s.rect(a,b,4.8,5.5,stroke=MUTED,width=.18)
    a,b=p(12.8,2.1);s.circle(a,b,3,MUTED)
    # Storage shelves remain separate from reception and booth.
    for yy in [.65,2.6]:a,b=p(.4,yy);s.rect(a,b,18,4,stroke=MUTED,width=.15)
 else:
    for xx in [1.1,3.2]:
        for yy in [1.6,4.8]:
            a,b=p(xx,yy);s.rect(a,b,14,7,stroke=MUTED,width=.16);s.circle(a+7,b+9,1.8,MUTED,width=.15)
    a,b=p(7.0,10.4);s.rect(a,b,32,12,stroke=MUTED,width=.16)
    for xx in [7.6,8.7,9.8]:
        for yy in [8.85,10.75]:a,b=p(xx,yy);s.circle(a,b,1.8,MUTED,width=.15)
    a,b=p(2.9,10.9);s.rect(a,b,19,5,stroke=MUTED,width=.16)
    a,b=p(12.0,2.2);s.rect(a,b,25,10,stroke=MUTED,width=.16)
 dims(s,x,y,160,116)
 # Stated width is tied to canonical circulation dimensions.
 if f['id']=='1F':
    a,b=p(2.6,2.65);s.line(a,b,a+18,b,MUTED,.13);s.text(a+9,b-1.1,'1,800',5.8,anchor='middle')
 a,b=p(6.2,0);s.text(a,b+7,'南側・正面外観の向き',6.7,color=MUTED,anchor='middle')
 # Studio area dimensions explicitly remain interface assumptions.
 s.text(x,y+141,'薄青：収録区画の仮枠。内部の机・機材・遮音仕様は空白。',6.8,color='#607d8d')

def arrow(s,start,control,end,color):
 s.path([start,(*control,*end)],color,.45)
 angle=math.atan2(end[1]-control[3],end[0]-control[2])
 for sign in [-1,1]:s.line(end[0],end[1],end[0]-3*math.cos(angle+sign*.4),end[1]-3*math.sin(angle+sign*.4),color,.45)

def overview(c,annotated):
 s=Sheet(c);s.rect(0,0,420,297,fill=PAPER)
 s.text(18,18,'AI TSUYAKU RADIO',10.2,color='#647985')
 s.text(18,31,'本社全体 平面図',22)
 s.text(18,40,'外観を起点に、暮らしと制作の動線をつなぐ。',9,color=MUTED)
 s.text(401,19,'HEADQUARTERS / 01',9.0,anchor='end')
 s.text(401,28,'設定図・寸法は仮定｜2026.10.01',8,anchor='end')
 s.text(401,37,'A3 原寸 1:100  /  単位 mm',8,anchor='end')
 s.line(18,47,402,47,INK,.35)
 draw_floor(s,floors[0],29,97);draw_floor(s,floors[1],229,97)
 # North arrow is explicitly a plan orientation, not an observed site orientation.
 s.line(209,83,209,69,INK,.35);s.path([(206.8,74),(209,69),(211.2,74)],INK,.35);s.text(209,65,'N*',7.5,anchor='middle')
 s.text(209,89,'図上',6,anchor='middle')
 s.line(18,244,402,244,'#b6bfc1',.2)
 s.text(18,252,'動線：受付 → 共用通路 → コントロール → 録音室。廊下から録音室へ直接入る扉は設けない。',8.3)
 s.text(18,259,'1階 A：主収録用 ／ 2階 B：サブ収録用。ブース内の設計は、ユーザー作成の詳細図へ置き換える。',8.0)
 s.text(18,266,'外形 16.0 × 11.6 m ／ 各階 185.6 m² ／ 延べ 371.2 m²。図上N・奥行き・各室寸法は設計上の仮定。',7.5,color=MUTED)
 # Exact graphic scale bar, 5 m = 50 mm at 1:100.
 for i in range(5):s.rect(18+i*10,279,10,2,fill=INK if i%2==0 else PAPER,stroke=INK,width=.12)
 for i in [0,1,5]:s.text(18+i*10,286,str(i)+' m' if i==5 else str(i),6.5,anchor='middle')
 s.text(85,280,'実測復元ではなく、画像を手がかりに寸法の整合を取った設定用の計画図。',7.2,color=MUTED)
 s.text(85,287,'実線：本社側の配置案 ／ 破線・薄青：ブースの仮枠と仮接続口。注釈は図面寸法を変更しない。',7.0,color=MUTED)
 s.text(401,284,'HQ-01 / '+('ANNOTATED' if annotated else 'CLEAN'),8,anchor='end')
 if annotated:
    # Three distinct handwriting faces/colours; no invented gender attribution.
    s.text(29,57,'廊下は「紺 × 木 × 暖色」で！',11,'Klee',NOTE_COLORS[1],rotation=-1)
    arrow(s,(83,60),(85,72,60,127),(62,142),NOTE_COLORS[1])
    s.text(246,57,'2階は、打合せも落ち着いて。',11,'Zen',NOTE_COLORS[2],rotation=1)
    arrow(s,(301,60),(313,67,311,79),(309,105),NOTE_COLORS[2])
    s.text(27,230,'中の配置は、あとからじっくり。',11,'Yomogi',NOTE_COLORS[0],rotation=-1)
    arrow(s,(113,228),(119,225,117,217),(119,198),NOTE_COLORS[0])
    s.text(222,230,'階段の位置は、上下でそろえる！',11,'Klee',NOTE_COLORS[1],rotation=1)
    arrow(s,(347,228),(405,224,405,158),(372,143),NOTE_COLORS[1])
    # A tiny margin memo adds another author-like voice without obscuring labels.
    s.text(186,222,'来客はこちら →',9,'Zen',NOTE_COLORS[2],anchor='end')
    arrow(s,(164,218),(173,218,175,216),(169,207),NOTE_COLORS[2])
 return s

pdf=OUT/'headquarters-floorplans.pdf'
c=canvas.Canvas(str(pdf),pagesize=(420*mm,297*mm))
c.setTitle('AI通訳ラジオ本社｜全体平面図・注釈版と設計版')
c.setAuthor('AI通訳ラジオ / Codex')
for annotation,file in [(True,'headquarters-annotated.svg'),(False,'headquarters-clean.svg')]:
 s=overview(c,annotation);s.svg(OUT/file);c.showPage()
# Source/assumption sheet: images are evidence for appearance, not surveyed geometry.
s=Sheet(c);s.rect(0,0,420,297,fill=PAPER)
s.text(18,22,'REFERENCE & DESIGN NOTES',12,color=MUTED)
s.text(18,37,'採用した要素と、仮定した要素',21)
s.text(18,48,'図面を更新するときに、画像の雰囲気と構造の根拠を混同しないための記録。',9,color=MUTED)
library=ROOT/'video/assets/higgsfield-studio-library-20260930'
s.image(library/'09-headquarters-exterior.png',18,61,183,102.94)
s.image(library/'07-headquarters-corridor.png',220,61,183,102.94)
s.text(18,173,'09 外観：採用',11)
s.text(220,173,'07 通路：素材感だけを採用',11)
for i,t in enumerate(['2階建て・陸屋根・正面右の玄関。','1階の大きなガラスと、2階の3つの窓区画。','幅16.0m・奥行11.6m・階高3.4mは仮定。']):s.text(18,181+i*7,t,9)
for i,t in enumerate(['紺の壁、木の床・枠、暖色の線状照明。','録音室への直通扉・斜めの扉は採用しない。','写っているブースの机・機材・間取りは参照しない。']):s.text(220,181+i*7,t,9)
s.line(18,205,402,205,'#b6bfc1',.2)
s.text(18,217,'二つの収録区画について',12)
for i,t in enumerate(['A：録音室 約19.2m²＋コントロール 約18.4m²。 B：録音室 約16.2m²＋コントロール 約15.6m²。', '両区画とも家具なしの仮枠。接続口・仕切り・観察窓・防音扉はユーザーの詳細図で更新する。', '二室の動線は明示したが、遮音性能やブースの音響設計は、この図面で確定していない。']):s.text(18,226+i*7,t,9)
s.text(18,255,'事例の参照：WSDG Vienna City Sound（大小の区画分け）／ Audible（収録・待機・設備の機能分け）。',8)
s.text(18,262,'事例の寸法や図面は転載せず、本社外観と今回の用途に合わせて独自に配置した。参照URLはREADMEに記載。',8,color=MUTED)
s.text(18,278,'手書き風：Yomogi / Klee One / Zen Kurenaido。フォントとOFLを同梱。本文・寸法は読みやすさを優先。',8,color=MUTED)
c.showPage();c.save()
doc=pdfium.PdfDocument(str(pdf))
for index,name in [(0,'headquarters-annotated.png'),(1,'headquarters-clean.png'),(2,'reference-notes.png')]:
 doc[index].render(scale=240/72).to_pil().save(OUT/name)

# Boundary-sensitive verification: room fit, intersections, axis-aligned portals, graph and common stair footprint.
checks={'room_overlaps':[],'rooms_outside_envelope':[],'portal_boundary_errors':[],'studio_routes':{},'all_rooms_reachable':{},'stairs_align':floors[0]['rooms'][-1]['rect']==floors[1]['rooms'][-1]['rect']}
def touches(r,q):
 x,y,w,h=r['rect'];xx,yy=q['center'];half=q['clear_width_m']/2
 if q['orientation']=='h':return (abs(yy-y)<.101 or abs(yy-(y+h))<.101) and xx-half>=x-.101 and xx+half<=x+w+.101
 return (abs(xx-x)<.101 or abs(xx-(x+w))<.101) and yy-half>=y-.101 and yy+half<=y+h+.101
for f in floors:
 rooms=f['rooms'];by_id={r['id']:r for r in rooms}
 for i,a in enumerate(rooms):
    x,y,w,h=a['rect']
    if min(x,y)<.199 or x+w>15.801 or y+h>11.401:checks['rooms_outside_envelope'].append(a['id'])
    for b in rooms[i+1:]:
        X,Y,W,H=b['rect']
        if min(x+w,X+W)-max(x,X)>1e-6 and min(y+h,Y+H)-max(y,Y)>1e-6:checks['room_overlaps'].append([a['id'],b['id']])
 for q in f['portals']:
    for rid in q['connects']:
        if rid!='outside' and not touches(by_id[rid],q):checks['portal_boundary_errors'].append([q['id'],rid])
 # Only each control room can connect the corresponding recording room to shared circulation.
 recording='recordA' if f['id']=='1F' else 'recordB';control='controlA' if f['id']=='1F' else 'controlB'
 connections=[q['connects'] for q in f['portals'] if recording in q['connects']]
 checks['studio_routes'][f['id']]={'recording_connections':connections,'only_via_control':connections==[[control,recording]],'furniture_in_booth':False}
 graph = {rid:set() for rid in by_id}
 for q in f['portals']:
    a,b=q['connects']
    if a in graph and b in graph:graph[a].add(b);graph[b].add(a)
 reached=set();stack=['lobby' if f['id']=='1F' else 'stairs2']
 while stack:
    node=stack.pop()
    if node not in reached:reached.add(node);stack.extend(graph[node]-reached)
 checks['all_rooms_reachable'][f['id']]=reached==set(by_id)
assert not checks['room_overlaps'] and not checks['rooms_outside_envelope'] and not checks['portal_boundary_errors'], checks
assert checks['stairs_align'] and all(v['only_via_control'] for v in checks['studio_routes'].values())
assert all(checks['all_rooms_reachable'].values())
checks['media_files_unchanged'] = source_before == {str(p): (p.stat().st_size, p.stat().st_mtime_ns) for p in reference_paths}
assert checks['media_files_unchanged']
checks['pdf_pages']=len(doc);checks['scale']='A3 landscape / 1:100 / 5m scale bar = 50mm'
checks['higgsfield_calls']=0;checks['higgsfield_credits']=0
checks['source_sha256']={n:hashlib.sha256((library/n).read_bytes()).hexdigest() for n in ['09-headquarters-exterior.png','07-headquarters-corridor.png']}
(OUT/'verification.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'pdf_pages':len(doc),'stairs_align':checks['stairs_align'],'studio_routes':checks['studio_routes'],'room_overlaps':checks['room_overlaps'],'portal_boundary_errors':checks['portal_boundary_errors']},ensure_ascii=False))
