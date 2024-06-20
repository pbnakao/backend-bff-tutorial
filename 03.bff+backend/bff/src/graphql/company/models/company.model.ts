import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/graphql/user/models/user.model";

@ObjectType()
export class Company {
    @Field(() => String)
    id: string;
    @Field(() => String)
    name: string;

    @Field(() => [User])
    users: Array<User>;
}
