import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.png':'image/png', '.mp4':'video/mp4', '.mp3':'audio/mpeg', '.m4a':'audio/mp4', '.woff2':'font/woff2' };
export async function startServer(port = 4173) {
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      const relative = path.relative(root, file);
      if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.'))) {
        res.writeHead(403).end(); return;
      }
      const body = await readFile(file);
      const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
      if(req.headers.range){
        const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
        if(!match){res.writeHead(416,{'Content-Range':`bytes */${body.length}`}).end();return;}
        const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),body.length-1):body.length-1;
        if(start>end||start>=body.length){res.writeHead(416,{'Content-Range':`bytes */${body.length}`}).end();return;}
        res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${body.length}`,'Content-Length':end-start+1});
        res.end(body.subarray(start,end+1));return;
      }
      res.writeHead(200,{...headers,'Content-Length':body.length});
      res.end(body);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { url } = await startServer(Number(process.env.PORT || 4173));
  console.log(`Preview: ${url}`);
}
