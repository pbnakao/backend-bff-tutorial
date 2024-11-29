import { Field, ObjectType } from "@nestjs/graphql";
import { City } from "src/graphql/city/models/city.model";

@ObjectType()
export class Prefecture {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => [City])
    cities: City[];
}