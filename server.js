import express from 'express';
import bodyParser from 'body-parser';
import net from 'net';
import { torrents } from './torrents.js'; // Importación nombrada correcta

const app = express();
app.use(bodyParser.json());

const DEFAULT_PORT = 10000;
const port = process.env.PORT || DEFAULT_PORT;

app.use(express.static('public'));

app.get('/api/torrents', (req, res) => {
    console.log(torrents);
    res.json(torrents || []);
});

app.post('/api/torrents', (req, res) => {
    const { id, title, magnet, description, type, poster, background } = req.body;

    if (!id || !title || !magnet || !description || !type) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    const newTorrent = { id, title, magnet, description, type, poster, background };
    torrents.push(newTorrent);

    res.status(201).json(newTorrent);
});

function checkPortAvailability(port, callback) {
    const server = net.createServer();
    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Puerto ${port} en uso. Usando otro...`);
            callback(false);
        }
    });
    server.once('listening', () => {
        server.close();
        callback(true);
    });
    server.listen(port);
}

checkPortAvailability(port, (isAvailable) => {
    const finalPort = isAvailable ? port : 10001;
    app.listen(finalPort, () => {
        console.log(`✅ Servidor web corriendo en http://localhost:${finalPort}`);
    });
});
