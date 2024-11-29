import { Field, ObjectType } from "@nestjs/graphql";
import { EntityModelResident } from "src/graphql/prefectures/models/entityModelResident";
import { Resident } from "src/graphql/resident/models/resident.model";

@ObjectType()
export class City {
    @Field(() => String, { description: '市区町村ID', nullable: false })
    id: string;
    @Field(() => String, { description: '市区町村名', nullable: false })
    name: string;
    @Field(() => [Resident], { description: '住民', nullable: false })
    residents: EntityModelResident[];
}