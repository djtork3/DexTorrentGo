// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { torrents } from './torrents.js';  // Asegúrate de que el archivo torrents.js está bien exportado

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.static('public'));  // Servir archivos estáticos (HTML, CSS, JS)

app.get('/api/torrents', (req, res) => {
    res.json(torrents);  // Devuelve los torrents actuales
});

app.post('/api/torrents', (req, res) => {
    const { id, title, magnet, description, type, poster, background } = req.body;
    
    if (!id || !title || !magnet || !description || !type) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    const newTorrent = { id, title, magnet, description, type, poster, background };
    torrents.push(newTorrent);  // Agrega el nuevo torrent a la lista

    res.status(201).json(newTorrent);  // Devuelve el torrent agregado
});

const port = process.env.PORT || 7001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
