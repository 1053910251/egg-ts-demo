import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
    typeorm: {
        enable: true,
        path: path.join(__dirname, '../app/lib/egg-typeorm'),
    },
};

export default plugin;
