import 'reflect-metadata';

import { Application } from 'egg';

export default (app: Application) => {
    app.beforeStart(async () => {
        // to do something
    });
};
