import {Connection, ConnectionOptions} from 'typeorm';
import {loadBasicModel, loadBizModel} from '../../lib/loader';

const BASIC_MODEL = Symbol('Application#basicModel');

declare module 'egg' {
    interface Application {
        basicModel: Connection;
        loadBizModel: (dbConfig: ConnectionOptions) => Promise<Connection>;
    }
}

module.exports = {
    get basicModel() {
        if (!this[BASIC_MODEL]) {
            this[BASIC_MODEL] = loadBasicModel(this);
        }
        return this[BASIC_MODEL];
    },
    loadBizModel(dbConfig) {
        return loadBizModel(this, dbConfig);
    },
};
