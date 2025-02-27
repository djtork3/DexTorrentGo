import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const { addonBuilder } = pkg;
const app = express();
const PORT = process.env.PORT || 10000;  // Forzar un solo puerto

// 📌 Servir manifest.json de forma manual
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

// 📌 Cargar y servir el Addon de Stremio
const builder = new addonBuilder(JSON.parse(fs.readFileSync('./manifest.json')));
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

// 📌 Hacer que Stremio use el puerto 10000 correctamente
const stremioInterface = builder.getInterface();
app.use('/', (req, res) => {
    stremioInterface(req, res);
});

// 📌 Iniciar el servidor Express
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`✅ Manifest disponible en http://localhost:${PORT}/manifest.json`);
});