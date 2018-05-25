import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {FaqEntity} from './faq.entity';

@Entity('FaqSimilars')
export class FaqSimilarEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '相似问句',
    })
    question: string;

    @Column('int')
    type: number;

    @Column('int')
    status: number;

    @Column('int', {
        comment: '标准问ID',
    })
    FaqId: number;

    /* 定义关联关系 */
    @ManyToOne(() => FaqEntity, (faq: FaqEntity) => faq.similars)
    @JoinColumn({
        name: 'FaqId',
        referencedColumnName: 'id',
    })
    faq: FaqEntity;
}
