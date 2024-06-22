const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:5000");

const role = "nodejs-client";

ws.on("open", function open() {
  console.log("Connected to server");
  sendMessage({ data: "nodejs-client register" });
});

ws.on("message", function incoming(data) {
  try {
    if (!Buffer.isBuffer(data)) throw new Error(`Received data from server: ${data}`);

    console.log(`Received message from server ${data.toString()}`);
  } catch (error) {
    console.error(error);
  }
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");
});

function sendMessage(message) {
  const data = { role, message };
  ws.send(JSON.stringify(data));
}

setInterval(() => {
  if (ws.readyState !== WebSocket.OPEN) return;
  sendMessage("test");
}, 5000);
