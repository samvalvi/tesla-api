import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  model: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('int', {
    default: 0,
  })
  quantity: number;

  @Column('text', {
    array: true,
    default: [],
  })
  colors: string[];

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @BeforeInsert()
  checkNameInsert() {
    this.name = this.name.toLowerCase().replace(' ', '_').replace("'", '');
  }

  @BeforeInsert()
  checkModelInsert() {
    this.model = this.model.toLowerCase().replace(' ', '_').replace("'", '');
  }

  @BeforeUpdate()
  checkNameUpdate() {
    this.name = this.name.toLowerCase().replace(' ', '_').replace("'", '');
  }

  @BeforeUpdate()
  checkModelUpdate() {
    this.model = this.model.toLowerCase().replace(' ', '_').replace("'", '');
  }
}
