import { Field, ObjectType } from "@nestjs/graphql";
import { Resident } from "src/graphql/resident/models/resident.model";

@ObjectType()
export class City {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => [Resident])
    residents: Resident[];
}