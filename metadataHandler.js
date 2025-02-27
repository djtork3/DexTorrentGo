// metadataHandler.js
import { torrents } from './torrents.js';

export function handleMetadata({ id }) {
    const media = torrents.find(t => t.id === id);

    if (!media) {
        return Promise.resolve({ meta: null });
    }

    return Promise.resolve({
        meta: {
            id: media.id,
            name: media.title,
            description: media.description,
            poster: media.poster || 'https://via.placeholder.com/300x450?text=No+Poster',  
            background: media.background || 'https://via.placeholder.com/1280x720?text=No+Background',
            type: media.type  // Aquí puede ser 'movie', 'series' o 'telenovelas'
        }
    });
}
