import http from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.png':'image/png','.glb':'model/gltf-binary','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(req.method === 'POST' && pathname.startsWith('/save/')) {
      const names={'/save/glb':['studio.glb','model/gltf-binary'],'/save/json':['studio-editable.json','application/json']};
      const item=names[pathname];
      if(!item || req.headers.origin !== 'http://127.0.0.1:4318') {res.writeHead(403).end();return;}
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>30*1024*1024){res.writeHead(413).end();return;}chunks.push(chunk);}
      const data=Buffer.concat(chunks);
      if(pathname.endsWith('glb') && data.toString('ascii',0,4)!=='glTF'){res.writeHead(400).end();return;}
      if(pathname.endsWith('json'))JSON.parse(data.toString());
      await mkdir(path.join(root,'exports'),{recursive:true});
      await writeFile(path.join(root,'exports',item[0]),data);
      res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({file:'exports/'+item[0],bytes:data.length}));return;
    }
    if(req.method !== 'GET' && req.method !== 'HEAD'){res.writeHead(405).end();return;}
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root)) {res.writeHead(403).end();return;}
    const body = await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch {res.writeHead(404).end('Not found');}
});
server.listen(4318,'127.0.0.1',()=>console.log('Studio preview: http://127.0.0.1:4318'));
