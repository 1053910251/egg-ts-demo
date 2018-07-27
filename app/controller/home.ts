import { Controller } from 'egg';
import {GET, PREFIX, Query, Validate} from '../lib/egg-request-mapping';
import {IsInt} from 'class-validator';

export class CreateDto {
    @IsInt()
    id: number;
}

@PREFIX('home')
export default class HomeController extends Controller {
    @GET('index')
    @Validate()
    public async index(@Query() body: object, @Query() query: CreateDto) {
        console.log(body);
        console.log(query);
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi('egg');
    }
}
