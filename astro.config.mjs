import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const pages = process.env.APPSECTRAIL_GITHUB_PAGES === 'true';
export default defineConfig({ output: 'static', integrations: [react()], ...(pages ? { site: 'https://carlossgluz.github.io', base: '/AppSecTrail' } : {}) });
