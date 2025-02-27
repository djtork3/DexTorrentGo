import pkg from 'stremio-addon-sdk';
import express from 'express';
import cors from 'cors';
import net from 'net';
import bodyParser from 'body-parser';
import { networkInterfaces } from 'os';
import { handleCatalog } from './catalogHandler.js';
import { handleStream } from './streamHandler.js';
import { handleMetadata } from './metadataHandler.js';
import { torrents, saveTorrents } from './torrents.js';

const { addonBuilder } = pkg;
const app = express();

// Configuración CORS extendida
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración del addon
const builder = new addonBuilder({
  id: "community.gaDexTorrentGo",
  name: "DexTorrentGo",
  version: "1.0.4",
  resources: ["catalog", "stream", "meta"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "movies",
      name: "Películas",
      extra: [{ name: "search", isRequired: false }]
    },
    {
      type: "series",
      id: "series",
      name: "Series",
      extra: [{ name: "search", isRequired: false }]
    }
  ],
  background: "https://i.ibb.co/LDDm7Mtn/ab1d7366-fae1-4d35-9ebb-8823a1de85f5.png",
  logo: "https://i.ibb.co/jvZWxGLS/logo.png",
  behaviorHints: {
    configurable: true,
    configurationRequired: false
  }
});

// Handlers
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

const addonInterface = builder.getInterface();

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/torrents', (req, res) => {
    res.json(torrents);
});

app.post('/api/torrents', (req, res) => {
    const { id, title, magnet, description, type, poster, background } = req.body;

    if (!id || !title || !magnet || !description || !type) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newTorrent = { id, title, magnet, description, type, poster, background };
    torrents.push(newTorrent);
    saveTorrents();  // Guardar los torrents en el archivo

    res.status(201).json(newTorrent);
});

// Endpoints del addon
app.get('/manifest.json', (req, res) => {
  res.set({
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json'
  }).json(addonInterface.manifest);
});

app.get('/:resource(meta|stream|catalog)/:type/:id.json', async (req, res) => {
    const { resource, type, id } = req.params;

    console.log(`📥 Solicitud recibida: ${resource} ${type}/${id}`);

    let handler;
    if (resource === 'catalog') handler = handleCatalog;
    else if (resource === 'stream') handler = handleStream;
    else if (resource === 'meta') handler = handleMetadata;

    if (!handler) {
        console.error(`❌ No se encontró un handler válido para ${resource}`);
        return res.status(404).json({ error: `Handler no encontrado para ${resource}` });
    }

    try {
        const response = await handler({ type, id });
        console.log(`✅ Respuesta exitosa: ${resource} ${type}/${id}`);
        res.set('Content-Type', 'application/json').json(response || []);
    } catch (error) {
        console.error(`❌ Error procesando ${resource}:`, error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint de estado
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.4',
    uptime: process.uptime(),
    catalogItems: torrents.length
  });
});

// Inicio del servidor
const startServer = (port = 10000) => {
  const server = net.createServer();
  server.once('error', () => {
    console.log(`🔄 Puerto ${port} ocupado, probando ${port + 1}`);
    startServer(port + 1);
  });

  server.once('listening', () => {
    server.close(() => {
      app.listen(port, '0.0.0.0', () => {
        const localIP = Object.values(networkInterfaces())
          .flat()
          .find(i => i.family === 'IPv4' && !i.internal)?.address;

        console.log(`
        🚀 Servidor operativo en:
        - Local:   http://localhost:${port}
        - Red:     http://${localIP}:${port}
        ----------------------------------
        🔗 Enlaces Stremio:
        - Manifest:   http://localhost:${port}/manifest.json
        - Status:     http://localhost:${port}/status
        `);
      });
    });
  });

  server.listen(port);
};

startServer();
