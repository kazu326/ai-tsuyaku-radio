"""Create an independent, editable Blender lighting/material study from the GLB."""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parent.parent
out = root / 'blender'
out.mkdir(exist_ok=True)
design = json.loads((root / 'scene.json').read_text(encoding='utf-8'))
specs = json.loads((root / 'materials.json').read_text(encoding='utf-8'))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(root / 'exports' / 'studio.glb'))
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1

def rgb(value):
    v = [int(value[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return tuple(x / 12.92 if x < .04045 else ((x + .055) / 1.055) ** 2.4 for x in v) + (1,)

def material(name, spec):
    m = bpy.data.materials.new('Studio / ' + name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    p = nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = rgb(spec['color'])
    p.inputs['Roughness'].default_value = spec.get('roughness', .8)
    p.inputs['Metallic'].default_value = spec.get('metalness', 0)
    if 'emissive' in spec:
        p.inputs['Emission Color'].default_value = rgb(spec['emissive'])
        p.inputs['Emission Strength'].default_value = spec.get('emissiveIntensity', 1) * .5
    if name == 'glass':
        p.inputs['Base Color'].default_value = rgb('#eef9ff')
        p.inputs['Transmission Weight'].default_value = 1
        p.inputs['Roughness'].default_value = .055
        p.inputs['IOR'].default_value = 1.45
    textured = name in ['oak', 'oakDark', 'floor', 'fabric', 'rug', 'navy', 'shade', 'goldMesh', 'pop']
    if textured:
        geo = nodes.new('ShaderNodeNewGeometry')
        geo.location = (-900, 0)
        scale = nodes.new('ShaderNodeVectorMath')
        scale.operation = 'MULTIPLY'
        scale.location = (-700, 0)
        scale.inputs[1].default_value = (1.6, 85, 5) if name in ['oak', 'oakDark', 'floor'] else (1, 1, 1)
        links.new(geo.outputs['Position'], scale.inputs[0])
        noise = nodes.new('ShaderNodeTexNoise')
        noise.location = (-500, 0)
        noise.inputs['Scale'].default_value = 2.3 if name in ['oak', 'oakDark', 'floor'] else (210 if name != 'navy' else 65)
        noise.inputs['Detail'].default_value = 3
        noise.inputs['Roughness'].default_value = .7
        links.new(scale.outputs['Vector'], noise.inputs['Vector'])
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.location = (-250, 100)
        base = rgb(spec['color'])
        ramp.color_ramp.elements[0].position = .22
        ramp.color_ramp.elements[0].color = tuple(c * .67 for c in base[:3]) + (1,)
        ramp.color_ramp.elements[1].position = .8
        ramp.color_ramp.elements[1].color = tuple(min(1, c * 1.23) for c in base[:3]) + (1,)
        links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
        links.new(ramp.outputs['Color'], p.inputs['Base Color'])
        bump = nodes.new('ShaderNodeBump')
        bump.location = (-200, -160)
        bump.inputs['Strength'].default_value = .18 if name != 'navy' else .08
        bump.inputs['Distance'].default_value = .0014 if name in ['oak', 'oakDark', 'floor'] else .0008
        links.new(noise.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], p.inputs['Normal'])
        if name in ['oak', 'oakDark', 'floor']:
            p.inputs['Roughness'].default_value = .46 if name == 'oak' else .58
            p.inputs['Coat Weight'].default_value = .12
            p.inputs['Coat Roughness'].default_value = .4
    p.location = (70, 70)
    return m

mats = {name: material(name, spec) for name, spec in specs.items()}
assignments = {}
def assign(spec):
    if spec['type'] == 'group':
        for child in spec['children']:
            assign(child)
    elif spec['type'] != 'text':
        obj = bpy.data.objects.get(spec['id'])
        if obj and obj.type == 'MESH':
            obj.data.materials.clear()
            obj.data.materials.append(mats[spec['material']])
            assignments[obj.name] = spec['material']
            # Thin bevels catch light on the otherwise sharp prototype boxes.
            if spec['type'] == 'box' and not spec.get('bevel') and spec['material'] not in ['glass', 'sky', 'cityGlow', 'screen', 'screenText']:
                bevel = obj.modifiers.new('Small edge highlight', 'BEVEL')
                bevel.width = min(min(obj.dimensions) * .13, .004)
                bevel.segments = 2
                bevel.limit_method = 'ANGLE'
for spec in design['objects']:
    assign(spec)

for obj in list(bpy.data.objects):
    if obj.type == 'LIGHT':
        bpy.data.objects.remove(obj, do_unlink=True)
world = bpy.data.worlds.new('Night studio environment')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = rgb('#597388')
world.node_tree.nodes['Background'].inputs['Strength'].default_value = .12
scene.world = world

def light(name, position, target, watts, color, size=1, kind='AREA'):
    data = bpy.data.lights.new(name, kind)
    data.energy = watts
    data.color = rgb(color)[:3]
    if kind == 'AREA':
        data.shape = 'DISK'
        data.size = size
    else:
        data.shadow_soft_size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()
    # Studio softboxes illuminate the room without appearing in the window view.
    if kind == 'AREA':
        obj.visible_camera = False
        obj.visible_glossy = False
        obj.visible_transmission = False
    return obj

light('LIGHT / warm key', (-1.6, -1.45, 2.72), (0, .6, .9), 700, '#ffe1b2', 2.2)
light('LIGHT / soft fill', (2, -1.05, 2.65), (0, .7, 1.05), 290, '#c6dcec', 2.1)
light('LIGHT / window blue', (-.96, 2.39, 1.95), (-.4, -.7, 1.1), 160, '#a3c8f4', 1.65)
light('LIGHT / ceiling bounce', (0, .2, 2.91), (0, .2, 0), 120, '#ffebd0', 2.4)
light('LIGHT / floor lamp', (2.35, 1.76, 1.50), (2.35, 1.76, 0), 42, '#ffbb72', .11, 'POINT')
light('LIGHT / corridor', (0, -4.2, 2.85), (0, -4.2, 0), 140, '#ffdfaf', 1.2)

# A separate ceiling is only added to this Blender study; the original GLB is intact.
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 3.055))
ceiling = bpy.context.object
ceiling.name = 'FINISH / studio ceiling'
ceiling.dimensions = (6.2, 5.2, .11)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
ceiling.data.materials.append(mats['navy'])
scene.camera = bpy.data.objects['cam_front']
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.transmission_bounces = 6
scene.cycles.seed = 42
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'
prefs.get_devices()
gpu = []
for device in prefs.devices:
    device.use = device.type == 'OPTIX'
    if device.use:
        gpu.append(device.name)
scene.cycles.device = 'GPU' if gpu else 'CPU'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.render.filepath = str(out / 'studio-front.png')
scene['production_note'] = 'Material and lighting study, no character. Original GLB preserved. Local render, no Higgsfield credits.'
scene['source_file'] = str(root / 'exports' / 'studio.glb')

# Opening the .blend shows the camera framing with quick material preview.
bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = bpy.data.objects['prop_desk']
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            area.spaces.active.region_3d.view_perspective = 'CAMERA'
            area.spaces.active.shading.type = 'MATERIAL'
            area.spaces.active.overlay.show_overlays = False
bpy.ops.file.pack_all()
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'studio-finished-v01.blend'))
bpy.ops.render.render(write_still=True)
report = {
    'blender': bpy.app.version_string,
    'source': 'exports/studio.glb',
    'blend': 'blender/studio-finished-v01.blend',
    'render': 'blender/studio-front.png',
    'camera': scene.camera.name,
    'render_engine': scene.render.engine,
    'gpu': gpu,
    'resolution': [1920, 1080],
    'samples': scene.cycles.samples,
    'imported_objects': 229,
    'objects_after_finish': len(bpy.data.objects),
    'materials_assigned': len(assignments),
    'embedded_images': [{'name': i.name, 'packed': bool(i.packed_file)} for i in bpy.data.images if i.source == 'FILE'],
    'higgsfield_calls': 0,
    'higgsfield_credits': 0,
}
(out / 'finish-report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
print('STUDIO_FINISH_COMPLETE ' + json.dumps(report, ensure_ascii=False))
