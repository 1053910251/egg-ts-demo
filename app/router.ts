import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/api/v1/faq/list', controller.v1.faq.list);
  router.get('/api/v1/faq/categories', controller.v1.faq.categories);
};
