"""Record the user's reset; preserve media and draw a reviewable floor-plan proposal."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[2]
out = Path(__file__).resolve().parent
old_dirs = [root / 'video/assets/higgsfield-studio-20260930', root / 'video/assets/higgsfield-studio-library-20260930', root / 'experiments/studio-3d-20261001']
reason = 'ユーザー判断：空間的一貫性がなく、左右・配置・PCの向き・扉の位置などに違和感があるため、以前のスタジオ画像・動画をすべて不採用。作り直しの参考に限って保持する。'
policy = {'decision_date_jst': '2026-10-01', 'status': 'rejected_reference_only', 'production_allowed': False, 'reference_allowed': True, 'reason': reason, 'scope': 'この相談で作成したスタジオ・本社の画像、動画、派生画像、静音版、Blender試作。既存の正式ヒーロー、ロゴ、猫素材、既存番組は対象外。'}
media = [p for folder in old_dirs for p in folder.rglob('*') if p.is_file() and p.suffix.lower() in ['.png', '.jpg', '.jpeg', '.mp4', '.blend', '.glb']]
before = {str(p): (p.stat().st_size, p.stat().st_mtime_ns) for p in media}

for folder in old_dirs[:2]:
    path = folder / 'manifest.json'
    data = json.loads(path.read_text(encoding='utf-8-sig'))
    data['adoption'] = policy
    for key in ['jobs', 'image_jobs', 'video_jobs']:
        for job in data.get(key, []):
            if 'review_status' in job and job['review_status'] != policy['status']:
                job.setdefault('previous_review_status', job['review_status'])
            job.update({'review_status': policy['status'], 'production_allowed': False, 'reference_allowed': True, 'review_reason': reason})
    if 'delivery_counts' in data:
        data.setdefault('historical_delivery_counts_before_reset', dict(data['delivery_counts']))
        data['delivery_counts']['image_candidates'] = 0
        data['delivery_counts']['video_candidates'] = 0
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(old_dirs[2] / 'adoption-status.json').write_text(json.dumps(policy, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

notice = '> **2026-10-01：現在の採用状態は「全件不採用・参考専用」です。** このフォルダのスタジオ画像・動画・派生素材は番組へ採用しません。削除せず、配色や素材感の参考として保持します。以下の採用候補・使い方は過去の記録であり、新しい配置の根拠にはしません。新方針は `experiments/studio-spatial-foundation-20261001/README.md` を参照してください。'
for path in [folder / 'README.md' for folder in old_dirs] + [old_dirs[2] / 'blender/README.md']:
    content = path.read_text(encoding='utf-8-sig')
    if notice not in content:
        title, rest = content.split('\n', 1)
        content = title + '\n\n' + notice + '\n' + rest
    if path.parent == old_dirs[1]:
        content = content.replace('## 使い方', '## 以前の使用想定（参考記録）')
        content = content.replace('人物が出る03を除き、修正版19を採用候補とします。', '当初は人物が出る03を除き、修正版19を採用候補としていました。現在は全19本不採用です。')
        content = content.replace('## 完了・費用', '## 生成時の記録・費用（過去の候補数）')
    path.write_text(content, encoding='utf-8')

preview_page = old_dirs[2] / 'index.html'
page = preview_page.read_text(encoding='utf-8')
banner = '<p id="adoption-notice" role="note"><strong>旧案・参考専用：番組用素材として不採用。配置も未確定です。</strong> 2026-10-01の方針変更により、簡易平面図から空間の一貫性を確認する案へ作り直します。</p>'
if 'id="adoption-notice"' not in page:
    preview_page.write_text(page.replace('<main>', '<main>\n' + banner, 1), encoding='utf-8')

layout = {
    'version': 1, 'date_jst': '2026-10-01', 'status': 'proposal_pending_review', 'layout_approved': False,
    'goal': '同じ3D空間のカメラだけを変えて、前後・左右の関係が矛盾しない土台を作る。',
    'coordinates': {'units': 'meters', 'origin': '床中央', 'x_positive': '東', 'y_positive': '北', 'z_positive': '上', 'note': '新案はBlenderのZ-up。旧Three.jsのY-upとは別の配置案。'},
    'room': {'width': 6, 'depth': 5, 'height': 3},
    'objects': {
        'desk': {'position': [0, .45, .77], 'size': [2.6, 1.12, .09]},
        'host_seat': {'position': [0, 1.35, .49], 'facing': [0, -1, 0]},
        'pc': {'position': [-.65, .45, .82], 'host_side': '右', 'screen_facing': [0, 1, 0], 'keyboard_side': '画面より北（ホスト側）'},
        'microphone': {'position': [.65, .5, 1.3], 'host_side': '左', 'pop_filter_position': [.65, .68, 1.3]},
        'door': {'wall': 'west', 'opening_center': [-3, -1.6, 1.2], 'opening_width': .9, 'opening_height': 2.4, 'hinge': [-3, -1.15, 0], 'open_leaf_endpoint': [-2.1, -1.15, 0]},
        'window': {'wall': 'north', 'center': [0, 2.5, 1.8], 'width': 2.4, 'note': '窓の向こう側の用途・空間は未確定。'},
        'lamp': {'position': [2.35, 1.8, 0]},
    },
    'camera_positions': {
        'front': {'position': [0, -2.1, 1.55], 'target': [0, .65, 1.15]},
        'rear': {'position': [0, 2.08, 1.65], 'target': [0, .15, 1.1]},
        'west': {'position': [-2.55, -.4, 1.55], 'target': [0, .6, 1.1]},
        'east': {'position': [2.55, -.4, 1.55], 'target': [0, .6, 1.1]},
    },
    'acceptance': [
        '一つのシーンを使い、撮影ごとに家具・機材・壁・窓・扉を動かさない。',
        '前後撮影では画面上の左右が自然に反転してよい。物体の世界座標と向きは固定する。',
        'PC画面・キーボードはホスト側を向く。正面カメラにはPCの背面、後方カメラには画面側が見える。',
        'PCは西、マイクは東、扉は西壁の南寄り、窓は北壁に固定する（いずれも未承認の配置案）。',
        '正面・後方・西側・東側を同じ状態でレンダーし、俯瞰図と照合する。',
        '生成画像から新しい角度を推測させる工程を、配置の確定や検証には使わない。',
        '配置が決まるまでは質感の仕上げや完成動画の制作に進まない。',
    ],
}
(out / 'layout-proposal.json').write_text(json.dumps(layout, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Diagram authoring, not AI image generation or alteration of the old media.
im = Image.new('RGB', (1440, 1100), '#f7f7f3')
d = ImageDraw.Draw(im)
font_file = 'C:/Windows/Fonts/meiryo.ttc'
def font(n): return ImageFont.truetype(font_file, n)
def label(x, y, text, size=22, fill='#172c3b', anchor=None): d.text((x, y), text, font=font(size), fill=fill, anchor=anchor)
def point(x, y): return (470 + x * 110, 510 - y * 110)
def arrow(a, b, fill='#b9671b', width=4):
    import math
    d.line([a, b], fill=fill, width=width)
    angle = math.atan2(b[1]-a[1], b[0]-a[0])
    for sign in [-1, 1]:
        d.line([b, (b[0]-16*math.cos(angle+sign*.45), b[1]-16*math.sin(angle+sign*.45))], fill=fill, width=width)
label(55, 34, 'AI通訳ラジオ｜空間の配置案 01', 36)
label(55, 90, '未確定の案です。質感より先に、位置と向きを確認します。', 22, '#59646a')
label(470, 185, '北：ホストの背後／窓の壁', 23, anchor='mm')
label(470, 835, '南：ホストの正面／正面カメラ', 23, anchor='mm')
d.rectangle([point(-3, 2.5), point(3, -2.5)], outline='#172c3b', width=8)
for x in [-2, -1, 0, 1, 2]: d.line([point(x, 2.45), point(x, -2.45)], fill='#e0e4e1', width=1)
for y in [-2, -1, 0, 1, 2]: d.line([point(-2.95, y), point(2.95, y)], fill='#e0e4e1', width=1)
d.line([point(-1.2, 2.5), point(1.2, 2.5)], fill='#a2c5d4', width=12)
label(470, 211, '窓（向こう側は未確定）', 20, anchor='mm')
d.rectangle([point(-1.3, 1.01), point(1.3, -.11)], fill='#dbcba9', outline='#655844', width=3)
label(470, 550, '机 2.6 × 1.12 m', 20, anchor='mm')
cx, cy = point(0, 1.35)
d.rounded_rectangle([cx-40, cy-30, cx+40, cy+30], radius=14, fill='#b0bcc3', outline='#172c3b', width=2)
label(cx+53, cy-13, 'ホスト席', 21)
arrow((cx, cy+34), (cx, cy+69))
# PC screen is on the south edge, facing north toward the host.
px, py = point(-.65, .45)
d.rectangle([px-34, py-15, px+34, py+21], fill='#a8bac5', outline='#172c3b', width=2)
d.line([(px-35, py+23), (px+35, py+23)], fill='#172c3b', width=7)
arrow((px, py+16), (px, py-32), '#217d99', 3)
label(px-24, py-49, 'PC', 21, anchor='mm')
mx, my = point(.65, .5)
d.ellipse([mx-12, my-12, mx+12, my+12], fill='#b99145', outline='#655844', width=2)
d.line([(mx-20, my-22), (mx+20, my-22)], fill='#172c3b', width=4)
label(mx+17, my-46, 'マイク', 21, anchor='mm')
label(278, 368, 'ホストの右', 18, '#59646a', anchor='mm')
label(662, 368, 'ホストの左', 18, '#59646a', anchor='mm')
# West wall doorway with inward swing. South end is the open gap.
d.line([point(-3, -1.15), point(-3, -2.05)], fill='#f7f7f3', width=12)
d.line([point(-3, -1.15), point(-2.1, -1.15)], fill='#9c784c', width=5)
hx, hy = point(-3, -1.15)
d.arc([hx-99, hy-99, hx+99, hy+99], 0, 90, fill='#9c784c', width=2)
label(74, 685, '扉', 24)
label(38, 719, '西壁・南寄り', 17)
lx, ly = point(2.35, 1.8)
d.ellipse([lx-16, ly-16, lx+16, ly+16], outline='#b9671b', width=3)
label(lx, ly+37, 'ランプ', 18, anchor='mm')
for name, xy, target in [('A 正面', (0, -2.1), (0, -1.4)), ('B 後方', (0, 2.08), (0, 1.65)), ('C 西側', (-2.55, -.4), (-1.65, .1)), ('D 東側', (2.55, -.4), (1.65, .1))]:
    ax, ay = point(*xy)
    d.ellipse([ax-11, ay-11, ax+11, ay+11], fill='#b9671b')
    arrow((ax, ay), point(*target), '#b9671b', 3)
    if name.startswith('B'): label(ax+100, ay-4, name, 18, '#b9671b', anchor='mm')
    elif name.startswith('A'): label(ax+75, ay, name, 18, '#b9671b', anchor='mm')
    elif name.startswith('C'): label(ax-8, ay+39, name, 18, '#b9671b', anchor='mm')
    else: label(ax+8, ay+39, name, 18, '#b9671b', anchor='mm')

label(870, 190, '見る位置が変わっても、物は動かさない', 24)
lines = [
    'ホストは北側に座り、南を向く。',
    'PC：ホストの右（図の左・西側）',
    'マイク：ホストの左（図の右・東側）',
    'PCの画面・キーボードはホスト側。',
    '扉：西壁の南寄り。窓：北壁。',
]
for i, text in enumerate(lines): label(870, 243 + i*45, text, 20)
d.line([(870, 495), (1380, 495)], fill='#c9d1d3', width=2)
label(870, 525, 'A 正面カメラから', 23)
label(870, 573, '画面左：PC ／ 画面右：マイク', 20)
label(870, 610, 'PCの背面が見える。', 20)
label(870, 683, 'B 後方カメラから', 23)
label(870, 731, '画面左：マイク ／ 画面右：PC', 20)
label(870, 768, 'PCの画面側が見える。', 20)
d.rounded_rectangle([(50, 900), (1390, 1050)], radius=12, fill='#e9eeed')
label(78, 925, '画面上の左右が入れ替わるのは、反対側から撮れば自然です。', 25)
label(78, 975, '問題にするのは、物の位置・向き・壁との関係が変わること。全アングルを同じシーンで検証します。', 21)
im.save(out / 'layout-proposal.png')

after = {str(p): (p.stat().st_size, p.stat().st_mtime_ns) for p in media}
assert before == after, 'Existing media changed unexpectedly'
inventory = [{'file': p.relative_to(root).as_posix(), 'bytes': p.stat().st_size, 'status': policy['status']} for p in media]
record = {'policy': policy, 'previous_scopes': [p.relative_to(root).as_posix() for p in old_dirs], 'current_production_candidates': 0, 'media_unchanged': before == after, 'reference_files': inventory, 'new_layout_status': layout['status'], 'higgsfield_calls': 0}
(out / 'asset-policy.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'reference_files': len(media), 'media_unchanged': before == after, 'production_candidates': 0, 'layout_status': layout['status']}, ensure_ascii=False))
