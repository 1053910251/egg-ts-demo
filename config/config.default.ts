import {EggAppConfig, PowerPartial} from 'egg';
import * as path from 'path';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
    sourceUrl: string;
}

export default (appInfo: EggAppConfig) => {
    const config = {} as PowerPartial<EggAppConfig> & BizConfig;

    // app special config
    config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1526115789339_3401';

    // add your config here
    config.middleware = ['errorHandler', 'userAuth', 'dbConnect'];

    config.typeorm = {
        type: 'mysql',
        host: '192.168.0.90',
        port: 3306,
        database: 'yibot_web',
        username: 'zhuiyi',
        password: '111111',
    };

    // 自定义log文件
    config.customLogger = {
        routeLogger: {
            file: path.join(appInfo.root, `logs/${appInfo.name}/egg-route.log`),
        },
    };

    // 配置 logger 文件的目录，logger 默认配置由框架提供
    config.logger = {
        dir: path.resolve(__dirname, `../logs/${appInfo.name}`),
    };
    return config;
};
