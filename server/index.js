const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000; // Soporte para variables de entorno

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../client')));
// Ruta para el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../client",'index.html'));
});

wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    // Envío a todos los clientes conectados menos al remitente
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  // Manejador de errores de WebSocket
  ws.on('error', (err) => {
    console.error('Error en WebSocket:', err);
  });
  // Notificación de desconexión
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(PORT, () => {
  console.log(`Servidor WebSocket en ejecución en http://localhost:${PORT}`);
});
