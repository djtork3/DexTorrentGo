// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { torrents } from './torrents.js';

const app = express();
const port = process.env.PORT || 8001; // Usar el puerto asignado por Koyeb

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/torrents', (req, res) => {
    res.json(torrents);
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

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

// Procfile
// web: node index.js & node server.js
