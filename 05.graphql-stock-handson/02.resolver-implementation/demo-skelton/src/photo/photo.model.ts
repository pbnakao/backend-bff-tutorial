import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Photo {
    @Field(() => ID)
    id: string;

    @Field()
    url: string;

    @Field()
    isMain: boolean;

    /* ───────── 追加フィールド ───────── */
    @Field()
    thumbnailUrl: string;      // = `${url}?w=300&h=200&fit=cover`
    /* ────────────────────────────── */
}
