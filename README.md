# WebSocket Broadcast Server

This project implements a WebSocket server that broadcasts messages to multiple clients.

## Features

- Broadcast messages to all connected clients
- Handle JSON formatted messages
- Assign unique IDs to each client
- Graceful shutdown handling

## Usage

### Starting the Server

```bash
npm run start
```

### Starting the Client

```bash
node client.js
```

### Code Overview

1. `BroadcastServer.js`

   - This file contains the `BroadcastServer` class which:
     - Manages WebSocket connections
     - Handles incoming messages and errors
     - Broadcasts messages to connected clients
     - Manages client connections with unique IDs

2. `index.js`

   - Provides an example of a Broadcast Server using the custom class `BroadcastServer`

3. `client.js`
   - Provides an example of a WebSocket client that connects to the server
