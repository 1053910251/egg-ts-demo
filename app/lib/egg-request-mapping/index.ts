import {RouteParamtypesEnum} from './enum/route-paramtypes.enum';

export * from './decorator/http-method.decorator';
export * from './decorator/router-params.decorator';
export * from './decorator/validate-params.decorator';

import {Application, Context} from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import {
    ROUTE_ARGS_METADATA, ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA, ROUTE_PARAM_VALIDATE_METADATA,
    ROUTE_PREFIX_METADATA, ROUTE_URL_METADATA,
    ROUTE_VALIDATE_METADATA,
} from './constant';
import {ValidateParamtypesEnum} from './enum/validate-paramtypes.enum';

class ResquestMapping {
    _prefix: string = '';

    _routes: Map<string, string> = new Map();

    setPrefix = (prefix: string) => {
        this._prefix = prefix;
    }

    remove(src: string, st: string) {
        const index = src.indexOf(st);
        if (index >= 0) {
            return src.substring(0, index);
        }
        return src;
    }

    scanDir(dir: string = '') {
        const appDir = this.remove(__dirname, 'app');

        if (!path.isAbsolute(dir)) {
            dir = path.join(appDir, 'app/controller', dir);
        }

        if (!fs.existsSync(dir)) {
            console.error(`Can not find directory: ${dir}`);
        }

        const files = fs.readdirSync(dir);
        let result = new Array<string>();
        files.map((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                result = [...result, ...this.scanDir(filePath)];
            } else if (stat.isFile()) {
                result.push(filePath);
            }
        });
        return result;
    }

    scanController(app: Application) {
        const files = this.scanDir();
        files.map((file) => {
            const controller = require(file).default;
            const prototype = controller.prototype;
            const handlers = Reflect.getMetadata(ROUTE_HANDLE_METADATA, prototype) || [];
            // 类装饰器，传入的是类的构造函数
            const urlPrefix = Reflect.getMetadata(ROUTE_PREFIX_METADATA, prototype.constructor) || '';
            handlers.forEach((methodName) => {
                // 方法装饰器，传入的是类的原型对象
                const httpMethod = Reflect.getMetadata(ROUTE_METHOD_METADATA, prototype, methodName);
                const urlPath = Reflect.getMetadata(ROUTE_URL_METADATA, prototype, methodName) || '';
                const urls = [this._prefix || '', urlPrefix, urlPath];
                const url = urls.filter((item) => item).join('/');
                if (this._routes.has(url)) {
                    app.emit('error', `[route]: ${url} already exists.`);
                }
                this._routes.set(url, `${file}#${methodName}`);
                app.getLogger('routeLogger').info(`[route]: ${url} >>> ${file}#${methodName}`);
                app.router[httpMethod](url, async (ctx: Context) => {
                    const instance = new controller(ctx);
                    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, prototype, methodName) || {};
                    const params: any[] = [];
                    for (const key of Object.keys(args)) {
                        const paramtype = +key.split(':')[0];
                        const paramName = args[key].data;
                        const paramIndex = args[key].index;
                        let param: any;
                        switch (paramtype) {
                            case RouteParamtypesEnum.REQUEST:
                                param = ctx.request;
                                break;
                            case RouteParamtypesEnum.RESPONSE:
                                param = ctx.response;
                                break;
                            case RouteParamtypesEnum.BODY:
                                param = paramName ? ctx.request.body[paramName] : ctx.request.body;
                                break;
                            case RouteParamtypesEnum.QUERY:
                                param = paramName ? ctx.request.query[paramName] : ctx.request.query;
                                break;
                            case RouteParamtypesEnum.PARAM:
                                param = paramName ? ctx.params[paramName] : ctx.params;
                                break;
                            case RouteParamtypesEnum.HEADERS:
                                param = paramName ? ctx.request.headers[paramName] : ctx.request.headers;
                                break;
                            case RouteParamtypesEnum.FILE_STREAM:
                                const fileStream = await ctx.getFileStream();
                                param = fileStream;
                                break;
                            default: break;
                        }
                        params[paramIndex] = param;
                    }
                    console.log(params);
                    const validate = Reflect.getMetadata(ROUTE_VALIDATE_METADATA, prototype, methodName);
                    console.log(validate);
                    // 若果需要校验
                    if (validate) {
                        // 校验类型
                        const validateArgs = Reflect.getMetadata(ROUTE_PARAM_VALIDATE_METADATA, prototype, methodName);
                        console.log(validateArgs);
                        for (const key of Object.keys(validateArgs)) {
                            const validateType = +key.split(':')[0];
                            // const validateIndex = validateArgs[key].index;
                            switch (validateType) {
                                case ValidateParamtypesEnum.REQUIRED: break;
                                default: break;
                            }
                        }
                    }
                    await instance[methodName](...params);
                });
            });
        });
    }
}

const rm = new ResquestMapping();

rm.setPrefix('/api');

export default rm;
