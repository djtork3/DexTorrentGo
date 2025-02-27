import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';
import { torrents } from './torrents.js';  

const { addonBuilder, serveHTTP } = pkg;
const app = express();
const PORT = process.env.PORT || 10000;  // Render asigna el puerto automáticamente

// 📌 Configurar Stremio Addon
const builder = new addonBuilder({
    "id": "My-DexTorrentGo",
    "name": "DexTorrentGo",
    "version": "1.0.2",
    "resources": ["catalog", "stream", "meta"],
    "types": ["movie", "series", "telenovelas"],
    "catalogs": [
      { "type": "movie", "id": "my-movie-catalog", "name": "DexTorrentGo" },
      { "type": "series", "id": "my-series-catalog", "name": "DexTorrentGo" },
      { "type": "telenovelas", "id": "my-telenovela-catalog", "name": "DexTorrentGo" }
    ],
    "background": "https://i.ibb.co/LDDm7Mtn/ab1d7366-fae1-4d35-9ebb-8823a1de85f5.png",
    "logo": "https://i.ibb.co/jvZWxGLS/logo.png",
    "behaviorHints": { "configurable": true, "configurationRequired": false }
});

builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

// 📌 Servir el addon en la misma API de Express
const addonInterface = builder.getInterface();

app.use(bodyParser.json());
app.use(express.static('public'));

// 📌 Exponer el `manifest.json` manualmente
app.get('/manifest.json', (req, res) => {
    res.json(addonInterface.manifest);
});

// 📌 Rutas de torrents
app.get('/api/torrents', (req, res) => res.json(torrents));
app.post('/api/torrents', (req, res) => {
    const { id, title, magnet, description, type, poster, background } = req.body;
    if (!id || !title || !magnet || !description || !type) {
        return res.status(400).send('Faltan campos obligatorios');
    }
    const newTorrent = { id, title, magnet, description, type, poster, background };
    torrents.push(newTorrent);
    res.status(201).json(newTorrent);
});

// 📌 Unificar Stremio con Express
app.use('/', (req, res) => serveHTTP(addonInterface, { req, res }));

// 📌 Iniciar el servidor en el puerto de Render
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ Addon disponible en http://localhost:${PORT}/manifest.json`);
});
