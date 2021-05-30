import { author, version } from '../package.json';

import colors from './colors';
import cooldowns from './cooldowns';

const config = {
    colors,
    cooldowns,

    prefix: `$`,

    version,
    footer: `© Created by ${author} | v${version}`
};

export default config;
