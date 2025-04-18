import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Supplier {
    @Field()
    name: string;

    @Field()
    phone: string;
}
