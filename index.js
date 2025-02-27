import pkg from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const { addonBuilder, serveHTTP } = pkg;
const PORT = process.env.PORT || 10000;

const manifest = {
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
};

const builder = new addonBuilder(manifest);
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

serveHTTP(builder.getInterface(), { port: PORT });

console.log(`✅ Addon corriendo en el puerto ${PORT}`);
console.log(`✅ Manifest accesible en http://localhost:${PORT}/manifest.json`);