// catalogHandler.js

import { torrents } from './torrents.js';

export function handleCatalog({ type }) {
    const filteredTorrents = torrents.filter(t => t.type === type);

    return Promise.resolve({
        metas: filteredTorrents.map(t => ({
            id: t.id,
            name: t.title,
            type: t.type  // Se adapta al tipo de contenido
        }))
    });
}
