import {
    ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA, ROUTE_PREFIX_METADATA, ROUTE_URL_METADATA,
} from '../constant';
import {HttpMethodEnum} from '../enum/http-method.enum';

const createHttpMethodDecorator = (methodtype) => {
    return (path: string = '') => {
        return (target: any, propertyKey: string) => {
            const handlers = Reflect.getMetadata(ROUTE_HANDLE_METADATA, target) || [];
            handlers.push(propertyKey);
            Reflect.defineMetadata(ROUTE_HANDLE_METADATA, handlers, target);
            // 设置方法
            Reflect.defineMetadata(ROUTE_METHOD_METADATA, methodtype, target, propertyKey);
            // 设置路由
            Reflect.defineMetadata(ROUTE_URL_METADATA, path, target, propertyKey);
        };
    };
};

export const GET = createHttpMethodDecorator(HttpMethodEnum.GET);
export const POST = createHttpMethodDecorator(HttpMethodEnum.POST);
export const PUT = createHttpMethodDecorator(HttpMethodEnum.PUT);
export const DELETE = createHttpMethodDecorator(HttpMethodEnum.DELETE);

const prefixDecorator = (prefix: string = '') => {
    return (target: any) => {
        Reflect.defineMetadata(ROUTE_PREFIX_METADATA, prefix, target);
    };
};

// 设置路由前缀
export const PREFIX = prefixDecorator;
