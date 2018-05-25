import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {CategoryEntity} from './category.entity';
import {FaqAnswerEntity} from './faq-answer.entity';
import {FaqSimilarEntity} from './faq-similar.entity';

@Entity('Faqs')
export class FaqEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        comment: '标准问题',
    })
    question: string;

    @Column('datetime', {
        comment: '生效开始时间',
    })
    validBeginTime: string;

    @Column('datetime', {
        comment: '生效结束时间',
    })
    validEndTime: string;

    @Column('int', {
        comment: 'faq状态',
    })
    status: string;

    @Column('datetime', {
        comment: '创建时间',
    })
    createdAt: string;

    @Column('datetime', {
        comment: '更新时间',
    })
    updatedAt: string;

    @Column('int', {
        comment: 'faq的类型',
    })
    faqType: number;

    @Column('int', {
        comment: '分类ID',
    })
    CategoryId: number;

    @Column('int', {
        comment: '关联的意图ID',
    })
    IntentionId: number;

    /* 定义关联关系 */
    @ManyToOne(() => CategoryEntity, (category: CategoryEntity) => category.faqs)
    @JoinColumn({
        name: 'CategoryId',
        referencedColumnName: 'id',
    })
    category: CategoryEntity;

    @OneToOne(() => FaqEntity)
    @JoinColumn({
        name: 'IntentionId',
        referencedColumnName: 'id',
    })
    intention: FaqEntity;

    @OneToMany(() => FaqAnswerEntity, (answer: FaqAnswerEntity) => answer.faq)
    answers: FaqAnswerEntity[];

    @OneToMany(() => FaqSimilarEntity, (similar: FaqSimilarEntity) => similar.faq)
    similars: FaqSimilarEntity[];
}
