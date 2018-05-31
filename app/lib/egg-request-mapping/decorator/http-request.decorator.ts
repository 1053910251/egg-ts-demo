import {CONTROLLER_METHOD_METADATA, HTTP_METHOD_METADATA, HTTP_PATH_METADATA} from '../constant';

const [GET, POST, PUT, DELETE] = ['get', 'post', 'put', 'delete'].map((method) => {
    return (path: string = '') => {
        return (target: any, propertyKey: string) => {
            const methods = Reflect.getMetadata(CONTROLLER_METHOD_METADATA, target) || [];
            methods.push(propertyKey);
            Reflect.defineMetadata(CONTROLLER_METHOD_METADATA, methods, target);
            Reflect.defineMetadata(HTTP_PATH_METADATA, path, target, propertyKey);
            Reflect.defineMetadata(HTTP_METHOD_METADATA, method, target, propertyKey);
        };
    };
});

export {
    GET,
    POST,
    PUT,
    DELETE
};
