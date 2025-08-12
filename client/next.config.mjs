import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false; // prevents trying to bundle canvas
        config.resolve.alias['pdfjs-dist'] = require.resolve('pdfjs-dist/legacy/build/pdf');
        return config;
    },
};

export default nextConfig;
