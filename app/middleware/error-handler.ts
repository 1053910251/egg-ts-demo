import {Context} from 'egg';

export default function errorHandlerMiddleware() {
    return async (ctx: Context, next: any) => {
        try {
            await next();
        } catch (e) {
            ctx.app.emit('error', e);
            ctx.body = e.getMessage();
        }
    };
};
