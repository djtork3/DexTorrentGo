import pkg from 'stremio-addon-sdk';
const { addonBuilder, serveHTTP } = pkg;
import { handleMetadata } from './metadataHandler.js';
import { handleStream } from './streamHandler.js';
import { handleCatalog } from './catalogHandler.js';

const builder = new addonBuilder({
    "id": "My-DexTorrentGo",
    "name": "DexTorrentGo",
    "version": "1.0.2",
    "resources": ["catalog", "stream", "meta"],  // Incluye los tres recursos
    "types": ["movie", "series", "telenovelas"],  // Tipos de contenido soportados
    "catalogs": [
      {
        "type": "movie",  // Catálogo para películas
        "id": "my-movie-catalog",
        "name": "Mis Peliculas"
      },
      {
        "type": "series",  // Catálogo para series
        "id": "my-series-catalog",
        "name": "Mis Series"
      },
      {
        "type": "telenovelas",  // Catálogo para telenovelas
        "id": "my-telenovela-catalog",
        "name": "Mis Telenovelas"
      }
    ]
});

builder.defineCatalogHandler(handleCatalog);
builder.defineStreamHandler(handleStream);
builder.defineMetaHandler(handleMetadata);

serveHTTP(builder.getInterface(), { port: 7000 });
