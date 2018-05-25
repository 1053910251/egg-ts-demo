import 'reflect-metadata';

import {Application} from 'egg';

export default (app: Application) => {
    app.beforeStart(async () => {
        // 很重要，通过ConnectManage 创建的连接需要再自行这个方法
        if (!app.basicModel.isConnected) {
            await app.basicModel.connect();
        }
        await app.basicModel.query('select 1+1');
    });
    app.logger.info('orm init success');
};
