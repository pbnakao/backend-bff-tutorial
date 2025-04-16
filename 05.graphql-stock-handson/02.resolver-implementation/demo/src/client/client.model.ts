import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Client {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    address?: string;

    /* ───────── 追加フィールド ───────── */
    @Field()
    displayName: string;       // = `${name}（都道府県）`
    /* ────────────────────────────── */
}
