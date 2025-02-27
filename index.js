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
    configurationRequired: false,
    configurationUrl: "index.html"  // Aquí puedes poner la URL de la página principal
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
    const { id, title, magnet, description, type, poster, background, season, episode } = req.body;

    if (!id || !title || !magnet || !description || !type) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Añadir trackers al enlace magnet
    const newTorrent = { id, title, magnet, description, type, poster, background, season, episode };
    newTorrent.magnet = addTrackersToMagnet(newTorrent.magnet);

    torrents.push(newTorrent);
    saveTorrents();  // Guardar los torrents en el archivo

    res.status(201).json(newTorrent);
});

// Función para añadir trackers
function addTrackersToMagnet(magnet) {
    const DEFAULT_TRACKERS = [
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://open.demonii.com:1337/announce",
    "udp://open.tracker.cl:1337/announce",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://explodie.org:6969/announce",
    "udp://tracker.skyts.net:6969/announce",
    "udp://tracker.qu.ax:6969/announce",
    "udp://tracker.ololosh.space:6969/announce",
    "udp://tracker.dler.org:6969/announce",
    "udp://tracker-udp.gbitt.info:80/announce",
    "udp://retracker01-msk-virt.corbina.net:80/announce",
    "udp://opentracker.io:6969/announce",
    "udp://open.free-tracker.ga:6969/announce",
    "udp://leet-tracker.moe:1337/announce",
    "udp://bt.ktrackers.com:6666/announce",
    "http://www.torrentsnipe.info:2701/announce",
    "http://www.genesis-sp.org:2710/announce",
    "http://tracker810.xyz:11450/announce",
    "http://tracker.xiaoduola.xyz:6969/announce",
    "https://tracker.bt4g.com:443/announce",
    "http://open.acgtracker.com:1096/announce",
    "udp://zer0day.ch:1337/announce",
    "http://tracker.dutchtracking.nl:80/announce",
    "udp://torrent.gresille.org:80/announce",
    "http://80.246.243.18:6969/announce",
    "http://178.175.143.27/announce",
    "http://210.244.71.26:6969/announce",
    "udp://shadowshq.yi.org:6969/announce",
    "udp://tracker.aletorrenty.pl:2710/announce",
    "http://torrentsmd.com:8080/announce",
    "udp://tracker.yoshi210.com:6969/announce",
    "http://tracker.edoardocolombo.eu:6969/announce",
    "udp://85.17.19.180:80/announce",
    "http://bt2.careland.com.cn:6969/announce",
    "udp://182.176.139.129:6969/announce",
    "https://www.wareztorrent.com/announce",
    "udp://62.212.85.66:2710/announce",
    "udp://62.138.0.158:6969/announce",
    "http://tracker.baravik.org:6970/announce",
    "udp://109.121.134.121:1337/announce",
    "http://158.69.146.212:7777/announce",
    "http://tracker2.itzmx.com:6961/announce",
    "udp://exodus.desync.com:6969/announce",
    "udp://tracker.coppersurfer.tk:6969/announce",
    "udp://89.234.156.205:80/announce",
    "http://t1.pow7.com/announce",
    "udp://5.79.249.77:6969/announce",
    "udp://tracker.ex.ua:80/announce",
    "udp://tracker.mg64.net:2710/announce",
    "http://173.254.204.71:1096/announce",
    "http://104.28.1.30:8080/announce",
    "udp://194.106.216.222:80/announce",
    "udp://114.55.113.60:6969/announce",
    "http://tracker.tvunderground.org.ru:3218/announce",
    "udp://128.199.70.66:5944/announce",
    "http://tracker2.wasabii.com.tw:6969/announce",
    "http://torrent.gresille.org/announce",
    "udp://tracker.kicks-ass.net:80/announce",
    "http://tracker1.wasabii.com.tw:6969/announce",
    "udp://tracker4.piratux.com:6969/announce",
    "http://thetracker.org:80/announce",
    "udp://185.86.149.205:1337/announce",
    "udp://bt.xxx-tracker.com:2710/announce",
    "udp://74.82.52.209:6969/announce",
    "udp://tracker.vanitycore.co:6969/announce",
    "udp://tracker.sktorrent.net:6969/announce",
    "udp://zer0day.to:1337/announce",
    "http://open.lolicon.eu:7777/announce",
    "udp://195.123.209.37:1337/announce",
    "udp://195.123.209.40:80/announce",
    "udp://37.19.5.155:2710/announce",
    "http://91.218.230.81:6969/announce",
    "http://91.217.91.21:3218/announce",
    "udp://retracker.lanta-net.ru:2710/announce",
    "udp://185.5.97.139:8089/announce",
    "udp://178.33.73.26:2710/announce",
    "http://tracker.mg64.net:6881/announce",
    "udp://eddie4.nl:6969/announce",
    "http://91.216.110.47/announce",
    "udp://p4p.arenabg.com:1337/announce",
    "udp://188.165.253.109:1337/announce",
    "udp://tracker.bittor.pw:1337/announce",
    "udp://tracker.kuroy.me:5944/announce",
    "http://p4p.arenabg.ch:1337/announce",
    "http://5.79.83.193:2710/announce",
    "udp://tracker.tiny-vps.com:6969/announce",
    "udp://tracker.ilibr.org:80/announce",
    "http://t2.pow7.com/announce",
    "udp://168.235.67.63:6969/announce",
    "udp://107.150.14.110:6969/announce",
    "udp://46.4.109.148:6969/announce",
    "udp://tracker.leechers-paradise.org:6969/announce",
    "udp://tracker.port443.xyz:6969/announce",
    "http://107.150.14.110:6969/announce",
    "http://retracker.krs-ix.ru:80/announce",
    "http://bt.pusacg.org:8080/announce",
    "udp://tracker.piratepublic.com:1337/announce",
    "udp://ipv4.tracker.harry.lu:80/announce",
    "http://tracker.bittorrent.am/announce",
    "http://secure.pow7.com/announce",
    "http://tracker.kamigami.org:2710/announce",
    "http://atrack.pow7.com/announce",
    "udp://tracker2.indowebster.com:6969/announce",
    "http://bt.henbt.com:2710/announce",
    "http://tracker.calculate.ru:6969/announce",
    "http://81.200.2.231/announce",
    "http://157.7.202.64:8080/announce",
    "http://46.4.109.148:6969/announce",
    "http://tracker3.itzmx.com:6961/announce",
    "udp://151.80.120.114:2710/announce",
    "udp://9.rarbg.to:2710/announce",
    "http://pow7.com:80/announce",
    "http://188.165.253.109:1337/announce",
    "udp://tracker.uw0.xyz:6969/announce",
    "http://51.254.244.161:6969/announce",
    "http://74.82.52.209:6969/announce",
    "http://open.touki.ru/announce",
    "udp://tracker1.itzmx.com:8080/announce",
    "udp://9.rarbg.com:2710/announce",
    "http://59.36.96.77:6969/announce",
    "udp://191.101.229.236:1337/announce",
    "udp://9.rarbg.to:2730/announce",
    "udp://9.rarbg.me:2780/announce",
    "udp://tracker.grepler.com:6969/announce",
    "http://87.253.152.137/announce",
    "udp://94.23.183.33:6969/announce",
    "udp://shadowshq.eddie4.nl:6969/announce",
    "udp://wepzone.net:6969/announce",
    "udp://ttk2.nbaonlineservice.com:6969/announce",
    "udp://tracker2.dler.org:80/announce",
    "udp://tracker1.myporn.club:9337/announce",
    "udp://tracker.tryhackx.org:6969/announce",
    "udp://tracker.torrust-demo.com:6969/announce",
    "udp://tracker.gmi.gd:6969/announce",
    "udp://tracker.gigantino.net:6969/announce",
    "udp://tracker.filemail.com:6969/announce",
    ];

    if (!magnet.includes("&tr=")) {
        return magnet + DEFAULT_TRACKERS.map(tr => `&tr=${encodeURIComponent(tr)}`).join("");
    }
    return magnet;
}

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
