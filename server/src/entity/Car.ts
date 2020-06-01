import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Car extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  make: string;

  @Field()
  @Column()
  model: string;

  @Field(() => Int)
  @Column("int", { default: 2000 })
  productionYear: number;
}
