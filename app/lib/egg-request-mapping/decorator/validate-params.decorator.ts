import {ROUTE_PARAM_VALIDATE_METADATA, ROUTE_VALIDATE_METADATA} from '../constant';
import {ValidateParamtypesEnum} from '../enum/validate-paramtypes.enum';

const assignMetadata = (args, paramtype, index, data) => {
    return Object.assign({}, args, {
        [`${paramtype}:${index}`]: {
            index,
            data,
        },
    });
};

const createValidateParamDecorator = (paramtypes) => {
    return (data?: any) => (target, key, index) => {
        console.log(arguments);
        const args = Reflect.getMetadata(ROUTE_PARAM_VALIDATE_METADATA, target, key);
        Reflect.defineMetadata(
            ROUTE_PARAM_VALIDATE_METADATA,
            assignMetadata(args, paramtypes, index, data),
            target,
            key,
        );
    };
};

export const Required = createValidateParamDecorator(ValidateParamtypesEnum.REQUIRED);

export const Validate = () => {
    return (target, key) => {
        Reflect.defineMetadata(ROUTE_VALIDATE_METADATA, true, target, key);
    };
};
