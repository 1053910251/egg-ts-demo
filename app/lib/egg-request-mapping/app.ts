import 'reflect-metadata';

import { Application } from 'egg';
import reqMapping from './index';

module.exports = (app: Application) => {
    reqMapping.scanController(app);
};
