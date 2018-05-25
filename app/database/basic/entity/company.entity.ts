import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {BusinessEntity} from './business.entity';

@Entity('Companies')
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '公司姓名',
    })
    name: string;

    @Column()
    owner: string;

    @Column('int')
    seed: number;

    @Column('datetime')
    createdAt: string;

    @Column('datetime')
    updatedAt: string;

    /* 定义关联关系 */
    @OneToMany(() => BusinessEntity, (business: BusinessEntity) => business.company)
    businesses: BusinessEntity[];
}
