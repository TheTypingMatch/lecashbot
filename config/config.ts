import { author, version } from '../package.json';

import colors from './colors';

import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    colors,
    prefix: `$`,

    version,
    footer: `© Created by ${author} | v${version}`
};

export default config;
