import { Service } from 'egg';
import {FaqEntity} from '../database/business/entity/faq.entity';

export default class FaqService extends Service {
    async list() {
        const { ctx } = this;
        const [ rows, count ] = await ctx.model.manager.getRepository(FaqEntity).findAndCount({
            where: {
                faqType: 20,
            },
            relations: ['category', 'intention', 'answers', 'similars'],
            skip: 0,
            take: 10,
        });
        return {
            count,
            rows,
        };
    }
}
