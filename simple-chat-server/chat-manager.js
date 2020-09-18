const producer = require('./producer');

let clients = [];
let chanels = ["all"];
let io;
let guestCount = 1;

function setIO(_io) {
  io = _io;
}

function add(socket) {
  const client = { id: socket.id, socket, name: `Guest${guestCount++}` };
  clients.push(client);
  socket.join(chanels[0]);
  const datetime = new Date().toString();
  const message = `[${datetime}] ${client.name} joins the channel`;
  io.to(chanels[0]).emit("chat", message);

  socket.on("chat", (msg) => {
      const client = clients.find(cl => cl.id === socket.id);
    const datetime = new Date().toString();
    const message = `[${datetime}] ${client.name} says: ${msg}`;
    producer.sendMessage(socket.id, message);
    io.to(chanels[0]).emit("chat", message);
  });
}

function all() {
  return clients;
}

module.exports = { add, all, setIO };
