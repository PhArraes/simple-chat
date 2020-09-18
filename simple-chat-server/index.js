const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const manager = require('./chat-manager');
const producer = require('./producer');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);
manager.setIO(io);

io.on('connect', socket => {
  console.log('connect');
  manager.add(socket);
});

httpServer.listen(3001, () => {
  console.log('go to http://localhost:3001');
});


