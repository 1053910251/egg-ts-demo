// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import DbConnect from '../../../app/middleware/db-connect';
import ErrorHandler from '../../../app/middleware/error-handler';
import UserAuth from '../../../app/middleware/user-auth';

declare module 'egg' {
  interface IMiddleware {
    dbConnect: ReturnType<typeof DbConnect>;
    errorHandler: ReturnType<typeof ErrorHandler>;
    userAuth: ReturnType<typeof UserAuth>;
  }
}
