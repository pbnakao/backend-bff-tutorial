import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Resident {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;
    @Field(() => String)
    sensitiveData: string;
}