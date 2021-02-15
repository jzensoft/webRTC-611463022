const { PeerServer } = require('peer');

const port = 9000;
const path = '/myapp';

const peerServer = PeerServer({ port: port, path: path });

peerServer.on('connection', (client) => { 
    console.log(`id: ${client.id} | token: ${client.token}`)
 });

console.log(`peer server running on localhost:${port}${path}`);