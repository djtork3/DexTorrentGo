// metadataHandler.js
import { torrents } from './torrents.js';

export function handleMetadata({ id }) {
    const content = torrents.find(t => t.id === id);

    if (!content) {
        return Promise.resolve({ meta: null });
    }

    console.log('Poster URL:', content.poster);  // Agrega esta línea para verificar si la URL del poster es correcta

    return Promise.resolve({
        meta: {
            id: content.id,
            name: content.title,
            description: content.description,
            type: content.type,
            poster: content.poster,  // Asegúrate de que este campo esté presente y correcto
            background: content.background
        }
    });
}
