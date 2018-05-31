import {RouteParamtypesEnum} from './enum/route-paramtypes.enum';

export * from './decorator/http-request.decorator';
export * from './decorator/router-params.decorator';

import {Application, Context} from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import {
    CONTROLLER_METHOD_METADATA, HTTP_METHOD_METADATA, HTTP_PATH_METADATA, HTTP_ROOT_PATH_METADATA, ROUTE_ARGS_METADATA,
} from './constant';

class ResquestMapping {
    _prefix: string = '';

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
            const rootPath = Reflect.getMetadata(HTTP_ROOT_PATH_METADATA, prototype) || '';
            const methods = Reflect.getMetadata(CONTROLLER_METHOD_METADATA, prototype) || [];
            methods.forEach((methodName) => {
                const httpMethod = Reflect.getMetadata(HTTP_METHOD_METADATA, prototype, methodName);
                const path = Reflect.getMetadata(HTTP_PATH_METADATA, prototype, methodName) || '';
                app.router[httpMethod](`${this._prefix}${rootPath}${path}`, async (ctx: Context) => {
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
                    await instance[methodName](...params);
                });
            });
        });
    }
}

const rm = new ResquestMapping();

rm.setPrefix('/api');

export default rm;
