import fs from 'fs';
import YAML from 'js-yaml';

import { logger } from '@/modules/utils';

export default (file: string) => {
    try {
        let yaml = YAML.load(fs.readFileSync(file, 'utf8'));
        return yaml;
    } catch (err) {
        logger.error(err);
        return err;
    }
}