"""Apply the user's narrow exceptions to the previous all-rejected decision."""
import json
from pathlib import Path

out = Path(__file__).resolve().parent
root = out.parents[1]
library = root/'video/assets/higgsfield-studio-library-20260930'
path = library/'manifest.json'
data = json.loads(path.read_text(encoding='utf-8'))
exceptions = [
 {'file':'video/assets/higgsfield-studio-library-20260930/09-headquarters-exterior.png','review_status':'accepted_exterior','production_allowed':True,'reference_allowed':True,'allowed_use':'本社外観の素材・世界観設定・間取り設計の参照。寸法は画像から実測した値ではない。'},
 {'file':'video/assets/higgsfield-studio-library-20260930/07-headquarters-corridor.png','review_status':'accepted_corridor_material_reference','production_allowed':False,'reference_allowed':True,'allowed_use':'通路の紺色の壁・木の床や枠・暖色照明のみ。写っている斜め扉、録音室への直通扉、ブースの間取りは採用しない。'}]
for job in data['image_jobs']:
 for ex in exceptions:
    if job['file']==Path(ex['file']).name:
        job.update({k:v for k,v in ex.items() if k!='file'})
        job['review_reason']='2026-10-01 ユーザーが一部採用へ変更。'+ex['allowed_use']
data['adoption']['status']='rejected_by_default_with_named_exceptions'
data['adoption']['reason']='旧素材は原則不採用。外観09は採用、通路07は素材感の参考として部分採用。動画・ブース画像・前回の3D試作は不採用を維持。'
data['adoption']['exceptions']=exceptions
data['delivery_counts']['image_candidates']=1
data['delivery_counts']['video_candidates']=0
data['delivery_counts']['accepted_material_references']=1
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

policy_path=root/'experiments/studio-spatial-foundation-20261001/asset-policy.json'
policy=json.loads(policy_path.read_text(encoding='utf-8'))
policy['policy'].update({'status':data['adoption']['status'],'reason':data['adoption']['reason'],'exceptions':exceptions})
policy['current_production_candidates']=1
policy['current_design_references']=2
for entry in policy['reference_files']:
 for ex in exceptions:
    if entry['file']==ex['file']:entry.update({'status':ex['review_status'],'production_allowed':ex['production_allowed'],'allowed_use':ex['allowed_use']})
policy['new_layout_status']='superseded_booth_proposal_user_will_design_details'
policy['current_headquarters_plan']='experiments/headquarters-plan-20261001/headquarters-layout.json'
policy_path.write_text(json.dumps(policy,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

notice='> **現行方針：外観09を採用、通路07は素材感のみ部分採用。** その他の旧画像・動画・3D試作は不採用を維持します。通路画像内の直通扉・斜め扉・ブース配置は引き継ぎません。本社全体の新しい図面は `experiments/headquarters-plan-20261001/README.md` を参照。ブース詳細はユーザー作成です。'
for path in [library/'README.md', root/'experiments/studio-spatial-foundation-20261001/README.md']:
 text=path.read_text(encoding='utf-8')
 if notice not in text:
    title,rest=text.split('\n',1);text=title+'\n\n'+notice+'\n'+rest
 text=text.replace('> **2026-10-01：現在の採用状態は「全件不採用・参考専用」です。**','> **履歴：一括不採用にした時点の記録（現行の例外は上記）。**')
 if path.parent.name=='studio-spatial-foundation-20261001':
    text=text.replace('## 以前の制作物の扱い','## 以前の制作物の扱い（一括不採用時点の履歴）')
    text=text.replace('## 配置案の確認','## 旧ブース配置案（現在はユーザー作成に変更）')
 path.write_text(text,encoding='utf-8')
for name in ['layout-proposal.json']:
 path=root/'experiments/studio-spatial-foundation-20261001'/name
 proposal=json.loads(path.read_text(encoding='utf-8'))
 proposal['status']='superseded_user_designs_booth'
 proposal['superseded_reason']='ブース詳細はユーザーが設計。本社全体の仮区画・接続はheadquarters-plan-20261001を参照。'
 path.write_text(json.dumps(proposal,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Adoption updated: exterior accepted; corridor materials only; videos remain rejected.')
