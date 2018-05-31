import 'reflect-metadata';

import {ROUTE_ARGS_METADATA} from '../constant';
import {RouteParamtypesEnum} from '../enum/route-paramtypes.enum';

const assignMetadata = (args, paramtype, index, data) => {
    return Object.assign({}, args, {
        [`${paramtype}:${index}`]: {
            index,
            data,
        },
    });
};

const createRouteParamDecorator = (paramtype) => {
    return (data) => (target, key, index) => {
        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key) || {};
        Reflect.defineMetadata(
            ROUTE_ARGS_METADATA,
            assignMetadata(args, paramtype, index, data),
            target,
            key,
        );
    };
};

export const Request = createRouteParamDecorator(RouteParamtypesEnum.REQUEST);
export const Response = createRouteParamDecorator(RouteParamtypesEnum.RESPONSE);
export const FileStream = createRouteParamDecorator(RouteParamtypesEnum.FILE_STREAM);
export const Headers = createRouteParamDecorator(RouteParamtypesEnum.HEADERS);

export const Query = (property?: string) => {
    return createRouteParamDecorator(RouteParamtypesEnum.QUERY)(property);
};

export const Body = (property?: string) => {
    return createRouteParamDecorator(RouteParamtypesEnum.BODY)(property);
};

export const param = (property?: string) => {
    return createRouteParamDecorator(RouteParamtypesEnum.PARAM)(property);
};

export const Req = Request;
export const Res = Response;
