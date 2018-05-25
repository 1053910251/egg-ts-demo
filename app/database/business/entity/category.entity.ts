import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {FaqEntity} from './faq.entity';

@Entity('Categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('int')
    parent: number;

    @Column('datetime')
    createdAt: string;

    @Column('datetime')
    updatedAt: string;

    @OneToMany(() => FaqEntity, (faq: FaqEntity) => faq.category)
    faqs: FaqEntity[];
}
