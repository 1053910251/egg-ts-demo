import { Application } from 'egg';

export default (app: Application) => {
  const { controller } = app;
  app.router.get('/api/faq/list', controller.v1.faq.list);
};
