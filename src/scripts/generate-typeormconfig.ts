import { ConfigService } from '@nestjs/config';
import fs = require('fs');

import { ConfigOptions } from 'src/config/config';

/**
 * This script will generate the ormconfig.json based on your Global Config
 * @param config Config Service for accessing the ENV Variables
 */
const generateTypeormConfigFile = (configSerivice: ConfigService) => {
  const typeormConfig = configSerivice.get(ConfigOptions.database);
  fs.writeFileSync('ormconfig.json', JSON.stringify(typeormConfig, null, 2));
};

export default generateTypeormConfigFile;
