import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:3001");
socket.on("chat", (message) => callback(message));
let subscribers = [];

function callback(message) {
  console.log(`received message : ${message}`);
  if (subscribers && subscribers.length)
    subscribers.forEach((sub) => {
      sub.callback({ message });
    });
}

function subscribeToChat(subs, callback) {
  subscribers = subscribers.filter((e) => e.id !== subs);
  subscribers.push({id: subs, callback});
}

function send(message) {
  socket.emit("chat", message);
}

export default { subscribeToChat, send };
