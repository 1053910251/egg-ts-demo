import { Application } from 'egg';
import {Connection, getConnectionManager} from 'typeorm';

export function createConn(app: Application) {
    const { config } = app;
    const options = {
        name: config.typeorm.database,
        type: config.typeorm.type,
        host: config.typeorm.host,
        port: config.typeorm.port || 3306,
        username: config.typeorm.username,
        password: config.typeorm.password,
        database: config.typeorm.database,
        logging: true,
        entities: [
            __dirname + '/entity/*.ts',
        ],
        synchronize: false,
    };
    const connectManager = getConnectionManager();
    let conn: Connection;
    if (connectManager.has(options.name)) {
        conn = connectManager.get(options.name);
    } else {
        conn = connectManager.create(options);
    }
    return conn;
}
