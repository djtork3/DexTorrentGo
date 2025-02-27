import fs from 'fs';

const torrentsFile = 'torrents.json';

export let torrents = [];

// Cargar torrents desde el archivo
if (fs.existsSync(torrentsFile)) {
    torrents = JSON.parse(fs.readFileSync(torrentsFile, 'utf-8'));
}

// Guardar torrents en el archivo
export const saveTorrents = () => {
    fs.writeFileSync(torrentsFile, JSON.stringify(torrents, null, 2), 'utf-8');
};
