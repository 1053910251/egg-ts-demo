import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {FaqEntity} from './faq.entity';

@Entity('FaqAnswers')
export class FaqAnswerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '答案内容',
    })
    answer: string;

    @Column({
        comment: '标签',
    })
    labels: string;

    @Column('int', {
        comment: '答案类型',
    })
    status: number;

    @Column({
        comment: '答案关联问',
    })
    relatedQuestions: 'string';

    @Column('datetime', {
        comment: '创建时间',
    })
    createdAt: string;

    @Column('datetime', {
        comment: '更新时间',
    })
    updatedAt: string;

    @Column('int', {
        comment: 'Faq的ID',
    })
    FaqId: number;

    /* 定义关联关系 */
    @ManyToOne(() => FaqEntity, (faq: FaqEntity) => faq.answers)
    @JoinColumn({
        name: 'FaqId',
        referencedColumnName: 'id',
    })
    faq: FaqEntity;
}
