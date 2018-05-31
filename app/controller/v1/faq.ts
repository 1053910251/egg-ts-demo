import { Controller } from 'egg';
import {CategoryEntity} from '../../database/business/entity/category.entity';
import {GET, Query} from '../../lib/egg-request-mapping';

export default class FaqController extends Controller {
    @GET('/faq/list')
    async list(@Query() query: object) {
        console.log(query);
        const { ctx } = this;
        const result = await ctx.service.faq.list();
        ctx.body = result;
    }
    @GET('/faq/categories')
    async categories() {
        const { ctx } = this;
        const res = await ctx.model.getRepository(CategoryEntity).find({
            relations: ['faqs'],
        });
        ctx.body = res;
    }
}
