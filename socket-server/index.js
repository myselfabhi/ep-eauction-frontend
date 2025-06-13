const { Server } = require('socket.io');
const io = new Server(4000, {
  cors: {
    origin: '*',
  },
});

const suppliers = ['SilverTrade Ltd.', 'OceanPack Corp', 'GlobalCarton Inc', 'EastBridge Exim', 'Apex Exporters'];

io.on('connection', (socket) => {
  console.log('EP Monitor Connected:', socket.id);

  setInterval(() => {
    const newBid = {
  supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
  lot: 'LOT-001',
  product: 'Kraft Boxes',
  fob: parseFloat((9.5 + Math.random() * 1).toFixed(2)),        // ✅ number
  freight: parseFloat((0.7 + Math.random() * 0.5).toFixed(2)),  // ✅ number
  duty: Math.floor(Math.random() * 5) + 4,                      // ✅ number
  time: new Date().toLocaleTimeString(),
};


    io.emit('bid-update', newBid); // Broadcast to all clients
  }, 6000);
});
