// index.js
import pkg from 'stremio-addon-sdk';
const { addonBuilder, serveHTTP } = pkg;
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const port = process.env.PORT || 8000; // Usar el puerto asignado por Koyeb

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
    "behaviorHints": {
      "configurable": true,
      "configurationRequired": false
    }
});

builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

serveHTTP(builder.getInterface(), { port });