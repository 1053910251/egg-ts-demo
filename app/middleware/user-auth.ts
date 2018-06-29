import { Context } from 'egg';

export default function userAuthMiddleware() {
    return async (ctx: Context, next: any) => {
        const businessId = ctx.headers.bid || 132711401;
        ctx.businessId = businessId;
        await next();
    };
}