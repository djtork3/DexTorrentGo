import express from 'express';
import bodyParser from 'body-parser';
import { torrents } from './torrents.js';

const app = express();
const PORT = process.env.PORT || 10000;

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

app.listen(PORT, () => {
    console.log(`✅ Servidor web corriendo en http://localhost:${PORT}`);
});
