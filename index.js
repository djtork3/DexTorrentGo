import { spawn } from 'child_process';
import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const { addonBuilder, serveHTTP } = pkg;
const ADDON_PORT = 5000;
const SERVER_PORT = 10000;

// Crear el addon Stremio
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

// Iniciar el addon en un puerto separado
serveHTTP(builder.getInterface(), { port: ADDON_PORT });
console.log(`✅ Addon disponible en http://localhost:${ADDON_PORT}/manifest.json`);

// Iniciar el servidor web como un proceso hijo
const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

serverProcess.on('close', (code) => {
  console.log(`❌ Servidor Express cerrado con código ${code}`);
});
