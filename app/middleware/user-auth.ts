import { Context } from 'egg';

export default function userAuthMiddleware() {
    return async (ctx: Context, next: any) => {
        ctx.businessId = 65537;
        await next();
    };
}