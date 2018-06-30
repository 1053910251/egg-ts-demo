import { Application } from 'egg';
import {Connection, getConnectionManager} from 'typeorm';
import * as path from 'path';

/**
 * 数据库连接信息
 */
export interface DbOption {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
}

/**
 * 创建数据库连接
 * @param {"egg".Application} app
 * @param {DbOption} dbOption
 * @return {Promise<void>}
 */
export async function createConn(app: Application, dbOption: DbOption) {
    const { config } = app;
    const entityAlias = path.resolve(__dirname, `entity/*.${app.config.env === 'local' ? 'ts' : 'js'}`);
    const db = {
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
    const dbConfig = Object.assign({}, db, dbOption);
    (<any> dbConfig).name = dbConfig.database;
    const connectManager = getConnectionManager();
    let conn: Connection;
    if (connectManager.has(dbConfig.database)) {
        conn = connectManager.get(dbConfig.database);
    } else {
        conn = connectManager.create(dbConfig);
    }
    if (!conn.isConnected) {
        await conn.connect();
    }
    return conn;
}
