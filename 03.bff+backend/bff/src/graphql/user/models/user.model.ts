import { Field, ObjectType } from "@nestjs/graphql";
import { Company } from "src/graphql/company/models/company.model";

@ObjectType()
export class User {
    @Field(() => String)
    id: number;
    @Field(() => String)
    name: string;
    @Field(() => Company)
    company: Company;
}
