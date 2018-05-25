import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {CompanyEntity} from './company.entity';

@Entity('Businesses')
export class BusinessEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '业务名称',
    })
    name: string;

    @Column('int', {
        comment: 'bizId',
    })
    bizId: number;

    @Column({
        comment: '数据库名称',
    })
    dbName: string;

    @Column({
        comment: '数据库地址',
    })
    dbIp: string;

    @Column({
        comment: '数据库端口',
    })
    dbPort: string;

    @Column({
        comment: '数据库用户名',
    })
    dbUser: string;

    @Column({
        comment: '数据库密码',
    })
    dbPassword: string;

    @Column('datetime')
    createdAt: string;

    @Column('datetime')
    updatedAt: string;

    @Column('int', {
        comment: '公司ID',
    })
    CompanyId: number;

    /* 定义关联关系 */
    @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.businesses)
    @JoinColumn({
        name: 'CompanyId',
        referencedColumnName: 'id',
    })
    company: CompanyEntity;
}
