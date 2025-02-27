import express from 'express';
import fs from 'fs';
import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const { addonBuilder, serveHTTP } = pkg;
const PORT = process.env.PORT || 10000;
const app = express();

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

// 📌 Construir el Addon de Stremio
const manifest = JSON.parse(fs.readFileSync('./manifest.json'));
const builder = new addonBuilder(manifest);
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

// 📌 Servir el addon en el puerto correcto
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
console.log(`✅ Manifest disponible en http://localhost:${PORT}/manifest.json`);