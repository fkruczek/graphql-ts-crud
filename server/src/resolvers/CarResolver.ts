import { Resolver, Mutation, Arg, Int, Query, InputType, Field } from "type-graphql";
import { Car } from "../entity/Car";

@InputType()
class CarInput {
  @Field()
  make: string;

  @Field()
  model: string;

  @Field(() => Int)
  productionYear: number;
}

@InputType()
class CarUpdateInput {
  @Field({ nullable: true })
  make?: string;

  @Field({ nullable: true })
  model?: string;

  @Field(() => Int, { nullable: true })
  productionYear?: number;
}

@Resolver()
export class CarResolver {
  @Mutation(() => Boolean)
  async createCar(@Arg("input", () => CarInput) input: CarInput) {
    const car = await Car.create(input).save();
    if (car) return true;
    return false;
  }

  @Mutation(() => Boolean)
  async updateCar(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => CarUpdateInput) input: CarUpdateInput
  ) {
    const car = await Car.update({ id }, input);
    if (car) return true;
    return false;
  }

  @Mutation(() => Boolean)
  async deleteCar(@Arg("id", () => Int) id: number) {
    await Car.delete({ id });
    return true;
  }

  @Query(() => [Car])
  async cars() {
    return await Car.find();
  }
}
