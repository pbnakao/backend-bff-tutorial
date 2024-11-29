import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Resident {
    @Field(() => String, { description: '住民ID', nullable: false })
    id: string;
    @Field(() => String, { description: '住民名', nullable: false })
    name: string;
    @Field(() => String, { description: '機密情報', nullable: true })
    sensitiveData?: string | undefined;
}