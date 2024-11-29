import { Field, ObjectType } from "@nestjs/graphql";
import { City } from "src/graphql/city/models/city.model";
import { EntityModelResident } from "src/graphql/prefectures/models/entityModelResident";

@ObjectType()
export class Prefecture {
    @Field(() => String, { description: '都道府県ID', nullable: false })
    id: string;
    @Field(() => String, { description: '都道府県名', nullable: false })
    name: string;
    @Field(() => [City], { description: '市区町村', nullable: false })
    cities: EntityModelResident[];
}