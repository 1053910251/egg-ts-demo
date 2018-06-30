import { Application } from 'egg';
import {Connection, getConnectionManager} from 'typeorm';
import * as path from 'path';

export function createConn(app: Application) {
    const { config } = app;
    const entityAlias = path.resolve(__dirname, `entity/*.${app.config.env === 'local' ? 'ts' : 'js'}`);
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
            entityAlias,
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
