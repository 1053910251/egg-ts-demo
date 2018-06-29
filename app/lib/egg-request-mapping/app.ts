import 'reflect-metadata';

import { Application } from 'egg';
import RequestMapping from './index';

module.exports = (app: Application) => {
    const reqMapping = new RequestMapping();
    if (app.config.globalPrefix) {
        reqMapping.setPrefix(app.config.globalPrefix);
    }
    reqMapping.scanController(app);
};
