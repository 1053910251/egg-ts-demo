import { Application } from 'egg';
import { createConn as createBasicConn } from '../../../database/basic';
import { createConn as createBizConn } from '../../../database/business';

/**
 * 加载基础数据库模型
 * @param {"egg".Application} app
 * @return {Promise<Connection>}
 */
export function loadBasicModel(app: Application) {
    return createBasicConn(app);
}

/**
 * 加载业务数据库模型
 * @param app
 * @param dbConfig
 * @return {Promise<Connection>}
 */
export async function loadBizModel(app, dbConfig) {
    return await createBizConn(app, dbConfig);
}
