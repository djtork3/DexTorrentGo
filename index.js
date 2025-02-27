import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';
import { torrents } from './torrents.js';
import fs from 'fs';

const { addonBuilder, serveHTTP } = pkg;
const app = express();
const PORT = process.env.PORT || 10000;  // Render asigna el puerto automáticamente

// 📌 Servir manifest.json manualmente
app.get('/manifest.json', (req, res) => {
    fs.readFile('./manifest.json', (err, data) => {
        if (err) {
            res.status(500).send('Error al cargar el manifest');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    });
});

// 📌 Configurar Stremio Addon
const builder = new addonBuilder(JSON.parse(fs.readFileSync('./manifest.json')));
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

// 📌 Unificar Stremio con Express
app.use('/', (req, res) => serveHTTP(builder.getInterface(), { req, res }));

// 📌 Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ Manifest disponible en http://localhost:${PORT}/manifest.json`);
});
