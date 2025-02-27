import fs from 'fs';

const torrentsFile = 'torrents.json';

const DEFAULT_TRACKERS = [
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://open.demonii.com:1337/announce",
    "udp://open.tracker.cl:1337/announce",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    // Añade más trackers según sea necesario
];

export let torrents = [];

// Cargar torrents desde el archivo
if (fs.existsSync(torrentsFile)) {
    torrents = JSON.parse(fs.readFileSync(torrentsFile, 'utf-8'));
    // Añadir trackers a los torrents existentes
    torrents = torrents.map(torrent => ({
        ...torrent,
        magnet: addTrackersToMagnet(torrent.magnet)
    }));
}

// Guardar torrents en el archivo
export const saveTorrents = () => {
    fs.writeFileSync(torrentsFile, JSON.stringify(torrents, null, 2), 'utf-8');
};

// Añadir trackers si faltan
function addTrackersToMagnet(magnet) {
    if (!magnet.includes("&tr=")) {
        return magnet + DEFAULT_TRACKERS.map(tr => `&tr=${encodeURIComponent(tr)}`).join("");
    }
    return magnet;
}

// Añadir un nuevo torrent
export function addTorrent(newTorrent) {
    if (!newTorrent.id || !newTorrent.title || !newTorrent.magnet || !newTorrent.poster || !newTorrent.description) {
        console.error("Error: Torrent con datos incompletos.");
        return false;
    }

    // Si el magnet no tiene trackers, los añadimos
    newTorrent.magnet = addTrackersToMagnet(newTorrent.magnet);

    // Evitar duplicados
    if (torrents.some(t => t.id === newTorrent.id)) {
        console.error("Error: El torrent ya existe.");
        return false;
    }

    torrents.push(newTorrent);
    saveTorrents();
    console.log("Torrent guardado correctamente.");
    return true;
}

// Eliminar un torrent
export function deleteTorrent(id) {
    torrents = torrents.filter(t => t.id !== id);
    saveTorrents();
    console.log(`Torrent ${id} eliminado correctamente.`);
}

// Ejecutar automáticamente al inicio
(async () => {
    // Guardar los cambios iniciales
    saveTorrents();
    console.log("Torrents cargados y trackers añadidos automáticamente.");
})();
