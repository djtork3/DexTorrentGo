// streamHandler.js

import { torrents } from './torrents.js';

export function handleStream({ id }) {
    const stream = torrents.find(t => t.id === id);

    if (!stream) {
        return Promise.resolve({ streams: [] });
    }

    return Promise.resolve({
        streams: [
            {
                title: stream.title,
                url: stream.magnet  // Aquí se devuelve el enlace magnet
            }
        ]
    });
}
