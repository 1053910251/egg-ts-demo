// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Home from '../../../app/controller/home';
import V1Faq from '../../../app/controller/v1/faq';

declare module 'egg' {
  interface IController {
    home: Home;
    v1: {
      faq: V1Faq;
    };
  }
}
