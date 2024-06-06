const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

class Client {
  id = uuidv4();
  ws = null;
  constructor(ws) {
    this.ws = ws;
  }
  update(client) {
    this.id = client.id;
    this.ws = client.ws;
  }
}

class BroadcastServer {
  constructor(port) {
    this.port = port;
    this.clients = new Map();
    this.server = new WebSocket.WebSocketServer({ port: this.port });
    this.server.on("listening", this.handleListening.bind(this));
    this.server.on("connection", this.handleConnection.bind(this));
  }

  handleListening() {
    console.log(`WebSocket server is running and listening on port ${this.port}`);
  }

  handleConnection(ws) {
    const client = new Client(ws);

    ws.on("message", (data) => this.handleMessage(data, client));
    ws.on("error", (err) => this.handleError(err, client));
    ws.on("close", () => this.handleClose(client));
  }

  handleMessage(data, client) {
    try {
      console.log(`Received message from client ${data.toString()}`);

      if (!isValidJSON(data)) throw new Error("message is a not valid JSON format");
      const { role, message } = JSON.parse(data);

      if (!this.clients.get(role)) this.clients.set(role, client);

      const existClient = this.clients.get(role);
      if (client.id !== existClient.id) {
        existClient.ws.terminate();
        existClient.update(client);
      }

      // A client broadcasting to every other connected clients, excluding itself.
      for (let [key, value] of this.clients) {
        if (key === role) continue;
        if (value.ws.readyState === WebSocket.OPEN) this.sendMessage(value.ws, message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  handleError(err, client) {
    console.error(`WebSocket error from client id ${client.id}`, err);
  }
  handleClose(client) {
    let closeRole;
    for (let [role, value] of this.clients) {
      if (client.id === value.id) closeRole = role;
    }
    if (!closeRole) return;
    console.log(`Connection closed from client ${closeRole}`);
    this.clients.delete(closeRole);
  }
  sendMessage(ws, message) {
    const data = typeof message === "string" ? message : { ...message };
    ws.send(JSON.stringify(data));
  }
  close() {
    this.server.clients.forEach((client) => client.terminate());
    this.clients.clear();
    this.server.close(() => {
      console.log("WebSocket server has been stopped");
    });
  }
}

module.exports = BroadcastServer;
