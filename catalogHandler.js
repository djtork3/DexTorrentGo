// catalogHandler.js

import { torrents } from './torrents.js';

export function handleCatalog({ type }) {
    const filteredTorrents = torrents.filter(t => t.type === type);

    return Promise.resolve({
        metas: filteredTorrents.map(t => ({
            id: t.id,
            name: t.title,
            type: t.type,
            poster: t.poster || 'https://via.placeholder.com/300x450?text=No+Poster'
        }))
    });
}
