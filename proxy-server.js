const http = require('http');

const targetHost = 'localhost';
const targetPort = 3002;
const port = 3100;

const server = http.createServer((req, res) => {
  const options = {
    hostname: targetHost,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

server.listen(port, () => {
  console.log(`代理服务器运行在 http://localhost:${port}`);
  console.log(`转发到 http://localhost:${targetPort}`);
});