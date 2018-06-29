import {RouteParamtypesEnum} from './enum/route-paramtypes.enum';

export * from './decorator/http-method.decorator';
export * from './decorator/router-params.decorator';
export * from './decorator/validate-params.decorator';

import {Application, Context} from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import {
    ROUTE_ARGS_METADATA, ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA,
    ROUTE_PREFIX_METADATA, ROUTE_URL_METADATA,
    ROUTE_VALIDATE_METADATA,
} from './constant';
import {ReflectDefaultMetadata} from './enum/reflect-default-metadata.enum';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {HttpException} from '../../exception';

class RequestMapping {
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
                // 方法装饰器声明的路由
                const urlPath = Reflect.getMetadata(ROUTE_URL_METADATA, prototype, methodName) || '';
                const urls = [this._prefix || '', urlPrefix, urlPath];
                const url = urls.filter((item, index) => item || index === 0).join('/');
                const routeKey = `[${httpMethod}]:${url}`;
                if (this._routes.has(routeKey)) {
                    // 路由重复
                    app.emit('error', `[route]${routeKey} already exists.`);
                }
                this._routes.set(routeKey, `${file}#${methodName}`);
                // 打印路由日志
                app.getLogger('routeLogger').info(`[route]${routeKey} >>> ${file}#${methodName}`);
                app.router[httpMethod](url, async (ctx: Context) => {
                    const instance = new controller(ctx);
                    // 路由 handler 通过装饰器声明的参数
                    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, prototype, methodName) || {};
                    // 获取方法的参数列表的类型
                    const argstypes = Reflect.getMetadata(
                        ReflectDefaultMetadata.DESGIN_PARAMTYPES,
                        prototype,
                        methodName,
                    );
                    const params: any[] = [];
                    // 是否需要校验
                    const isNeedValidate = Reflect.getMetadata(ROUTE_VALIDATE_METADATA, prototype, methodName);
                    for (const key of Object.keys(args)) {
                        // 参数的类型
                        const paramtype = +key.split(':')[0];
                        // 参数的名称
                        const paramName = args[key].data;
                        // 参数在arguments中的索引位置
                        const paramIndex = args[key].index;
                        // 相应索引位置的参数类型
                        const argstype = argstypes[paramIndex];
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
                        const clsObj = plainToClass(argstype, param);
                        // 校验
                        if (isNeedValidate) {
                            const errors = await validate(clsObj);
                            if (errors && errors.length) {
                                throw new HttpException('Validate Failed', 400, errors);
                            }
                        }
                        params[paramIndex] = clsObj;
                    }
                    await instance[methodName](...params);
                });
            });
        });
    }
}

export default RequestMapping;
