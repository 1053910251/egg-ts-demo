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
        host: '192.168.0.243',
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

    // 日志定时删除
    exports.logrotator = {
        filesRotateByHour: [],           // list of files that will be rotated by hour
        hourDelimiter: '-',              // rotate the file by hour use specified delimiter
        filesRotateBySize: [],           // list of files that will be rotated by size
        maxFileSize: 1024,   // Max file size to judge if any file need rotate
        maxFiles: 1,                    // pieces rotate by size
        rotateDuration: 1,           // time interval to judge if any file need rotate
        maxDays: 31,                     // keep max days log files, default is `31`. Set `0` to keep all logs
    };

    return config;
};
