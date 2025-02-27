import pkg from 'stremio-addon-sdk';
import express from 'express';
import cors from 'cors';
import net from 'net';
import bodyParser from 'body-parser';
import { networkInterfaces } from 'os'; // Importación corregida
import { handleCatalog } from './catalogHandler.js';
import { handleStream } from './streamHandler.js';
import { handleMetadata } from './metadataHandler.js';
import { torrents } from './torrents.js';

const { addonBuilder } = pkg;
const app = express();

// Configuración CORS para permitir solicitudes desde Stremio
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// Configuración del addon Stremio
const builder = new addonBuilder({
  "id": "community.gaDexTorrentGo",
  "name": "DexTorrentGo",
  "version": "1.0.3",
  "resources": ["catalog", "stream", "meta"],
  "types": ["movie", "series", "telenovelas"],
  "catalogs": [
    { "type": "movie", "id": "movies", "name": "Películas" },
    { "type": "series", "id": "series", "name": "Series" },
    { "type": "telenovelas", "id": "telenovelas", "name": "Telenovelas" }
  ],
  "background": "https://i.ibb.co/LDDm7Mtn/ab1d7366-fae1-4d35-9ebb-8823a1de85f5.png",
  "logo": "https://i.ibb.co/jvZWxGLS/logo.png",
  "behaviorHints": {
    "configurable": true,
    "configurationRequired": false
  }
});

// Handlers del addon
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

const addonInterface = builder.getInterface();

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoints del addon
app.get('/manifest.json', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(addonInterface.manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  handleCatalog({ type: req.params.type, id: req.params.id }, (error, catalog) => {
    error ? res.status(500).json({ error: error.message }) : res.json(catalog);
  });
});

app.get('/stream/:type/:id.json', (req, res) => {
  handleStream({ type: req.params.type, id: req.params.id }, (error, stream) => {
    error ? res.status(500).json({ error: error.message }) : res.json(stream);
  });
});

app.get('/meta/:type/:id.json', (req, res) => {
  handleMetadata({ type: req.params.type, id: req.params.id }, (error, meta) => {
    error ? res.status(500).json({ error: error.message }) : res.json(meta);
  });
});

// API endpoints
app.get('/api/torrents', (req, res) => {
  res.json(torrents || []);
});

app.post('/api/torrents', (req, res) => {
  const requiredFields = ['id', 'title', 'magnet', 'description', 'type'];
  if (!requiredFields.every(field => req.body[field])) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newTorrent = { ...req.body, added: new Date().toISOString() };
  torrents.push(newTorrent);
  res.status(201).json(newTorrent);
});

// Verificación y arranque del servidor
const checkPort = (port, callback) => {
  const server = net.createServer();
  server.once('error', () => callback(false));
  server.once('listening', () => {
    server.close();
    callback(true);
  });
  server.listen(port);
};

const startServer = (port = 10000) => {
  checkPort(port, available => {
    if (!available) {
      console.log(`🔄 Puerto ${port} ocupado, probando con ${port + 1}`);
      return startServer(port + 1);
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`
      ✅ Servidor listo en: http://localhost:${port}
      📄 Manifest URL: http://localhost:${port}/manifest.json
      🌍 Red local: http://${getLocalIp()}:${port}/manifest.json
      `);
    });
  });
};

// Función para obtener IP local (versión corregida)
const getLocalIp = () => {
    return Object.values(networkInterfaces())
      .flat()
      .find(i => i.family === 'IPv4' && !i.internal)?.address;
  };

startServer();