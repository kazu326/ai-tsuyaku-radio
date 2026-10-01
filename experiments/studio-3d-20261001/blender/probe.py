import bpy
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(root / 'exports' / 'studio.glb'))
report = {
    'version': bpy.app.version_string,
    'objects': len(bpy.data.objects),
    'meshes': len(bpy.data.meshes),
    'cameras': [o.name for o in bpy.data.objects if o.type == 'CAMERA'],
    'selected_objects': {},
    'cycles_devices': [],
}
for name in ['floor', 'desktop', 'chair_back', 'window_glass', 'wall_back_right', 'night_sky', 'mic_body', 'lamp_shade']:
    obj = bpy.data.objects.get(name)
    if obj:
        report['selected_objects'][name] = {
            'position': list(obj.matrix_world.translation),
            'dimensions': list(obj.dimensions),
            'materials': [m.name for m in obj.data.materials],
        }
prefs = bpy.context.preferences.addons['cycles'].preferences
for backend in ['OPTIX', 'CUDA', 'HIP', 'ONEAPI']:
    try:
        prefs.compute_device_type = backend
        prefs.get_devices()
        report['cycles_devices'].append({'backend': backend, 'devices': [{'name': d.name, 'type': d.type} for d in prefs.devices]})
    except Exception as exc:
        report['cycles_devices'].append({'backend': backend, 'error': str(exc)})
(root / 'blender' / 'import-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
