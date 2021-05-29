import { author, version } from '../package.json';

import colors from './colors';

const config = {
    colors,
    prefix: `$`,

    version,
    footer: `© Created by ${author} | v${version}`
};

export default config;
