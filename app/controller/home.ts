import { Controller } from 'egg';
import {Body, GET, Query} from '../lib/egg-request-mapping';

export default class HomeController extends Controller {
    @GET('/index')
    public async index(@Query('name') name: string, @Query('age') age: number, @Body() body: object) {
        console.log(name);
        console.log(age);
        console.log(body);
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi('egg');
    }
}
