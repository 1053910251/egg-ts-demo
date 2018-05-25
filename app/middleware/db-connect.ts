import { Context } from 'egg';
import {Connection} from 'typeorm';
import {BusinessEntity} from '../database/basic/entity/business.entity';

declare module 'egg' {
    interface Context {
        model: Connection;
    }
}

export default function dbConnectMiddleware() {
    return async (ctx: Context, next: any) => {
        const businessId = ctx.businessId;
        if (!businessId) {
            throw new Error('businessId is required');
        }
        const business: any = await ctx.app.basicModel.manager.findOne(BusinessEntity, {
            where: {
                bizId: businessId & 65535,
                CompanyId: businessId >> 16
            },
        });
        if (!business) {
            throw new Error('can`t find business');
        }
        const dbOption: any = {
            host: business.dbIp,
            port: business.dbPort,
            database: business.dbName,
            username: business.dbUser,
            password: business.dbPassword,
        };
        const conn: Connection = await ctx.app.loadBizModel(dbOption);
        Object.defineProperty(ctx, 'model', {
            value: conn,
            writable: false,
            configurable: false,
        });
        await next();
    };
}