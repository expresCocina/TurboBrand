import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Turbo Brand | Agencia de Marketing Digital & Growth',
        short_name: 'Turbo Brand',
        description: 'Agencia de Marketing 5.0 impulsada por inteligencia artificial',
        start_url: '/',
        display: 'standalone',
        background_color: '#252525',
        theme_color: '#9E0060',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '32x32',
                type: 'image/png',
            },
        ],
    };
}
