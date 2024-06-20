import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class CompaniesArgs {
    @Field(() => Int, { nullable: true })
    page?: number;
    @Field(() => Int, { nullable: true })
    size?: number;
    @Field(() => [String], { nullable: true })
    sort?: Array<string>;
}
