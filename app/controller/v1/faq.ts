import { Controller } from 'egg';
import {CategoryEntity} from '../../database/business/entity/category.entity';
import {GET, PREFIX, Query, Validate} from '../../lib/egg-request-mapping';

@PREFIX('faq')
export default class FaqController extends Controller {
    @GET('list')
    @Validate()
    async list(@Query() query: object) {
        console.log(query);
        const { ctx } = this;
        const result = await ctx.service.faq.list();
        ctx.body = result;
    }
    @GET('categories')
    async categories() {
        const { ctx } = this;
        const res = await ctx.model.getRepository(CategoryEntity).find({
            relations: ['faqs'],
        });
        ctx.body = res;
    }
}
