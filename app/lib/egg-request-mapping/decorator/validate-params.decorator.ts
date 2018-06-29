import {ROUTE_VALIDATE_METADATA} from '../constant';

/*const assignMetadata = (args, paramtype, index, data) => {
    return Object.assign({}, args, {
        [`${paramtype}:${index}`]: {
            index,
            data,
        },
    });
};

const createValidateParamDecorator = (paramtypes) => {
    return (data?: any) => (target, key, index) => {
        const args = Reflect.getMetadata(ROUTE_PARAM_VALIDATE_METADATA, target, key);
        Reflect.defineMetadata(
            ROUTE_PARAM_VALIDATE_METADATA,
            assignMetadata(args, paramtypes, index, data),
            target,
            key,
        );
    };
};*/

export const Validate = () => {
    return (target, key) => {
        Reflect.defineMetadata(ROUTE_VALIDATE_METADATA, true, target, key);
    };
};
