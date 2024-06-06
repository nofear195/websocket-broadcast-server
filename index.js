const BroadcastServer = require("./BroadcastServer");

const server = new BroadcastServer(5000);

// Handle SIGTERM signal
process.on("SIGTERM", () => server.close());

// Handle SIGINT signal
process.on("SIGINT", () => server.close());
