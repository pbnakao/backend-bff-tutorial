import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class PrefecturesArgs {
    @Field(() => String, { nullable: true })
    userId?: string | undefined;
}
