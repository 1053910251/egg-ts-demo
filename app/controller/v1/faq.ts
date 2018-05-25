import { Controller } from 'egg';
import {CategoryEntity} from '../../database/business/entity/category.entity';

export default class FaqController extends Controller {
    async list() {
        const { ctx } = this;
        const result = await ctx.service.faq.list();
        ctx.body = result;
    }
    async categories() {
        const { ctx } = this;
        const res = await ctx.model.getRepository(CategoryEntity).find({
            relations: ['faqs'],
        });
        ctx.body = res;
    }
}
