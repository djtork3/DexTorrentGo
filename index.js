import { addonBuilder, serveHTTP } from 'stremio-addon-sdk';
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const PORT = process.env.PORT || 10000;

// 📌 Definir el manifest directamente en el código (puedes cambiarlo si es necesario)
const builder = new addonBuilder({
    "id": "My-DexTorrentGo",
    "name": "DexTorrentGo",
    "version": "1.0.2",
    "resources": ["catalog", "stream", "meta"],
    "types": ["movie", "series", "telenovelas"],
    "catalogs": [
      {
        "type": "movie",
        "id": "my-movie-catalog",
        "name": "DexTorrentGo"
      },
      {
        "type": "series",
        "id": "my-series-catalog",
        "name": "DexTorrentGo"
      },
      {
        "type": "telenovelas",
        "id": "my-telenovela-catalog",
        "name": "DexTorrentGo"
      }
    ],
    "background": "https://i.ibb.co/LDDm7Mtn/ab1d7366-fae1-4d35-9ebb-8823a1de85f5.png",
    "logo": "https://i.ibb.co/jvZWxGLS/logo.png",
    "behaviorHints": {
      "configurable": true,
      "configurationRequired": false
    }
});

// 📌 Definir los manejadores del addon
builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

// 📌 Iniciar el servidor del addon con Stremio (sin Express)
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`✅ Servidor Stremio corriendo en http://localhost:${PORT}`);
console.log(`✅ Manifest disponible en http://localhost:${PORT}/manifest.json`);
