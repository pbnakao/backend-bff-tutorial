import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Client } from '../client/client.model';
import { Photo } from '../photo/photo.model';
import { PurchaseInfo } from '../purchase-info/purchase-info.model';

@ObjectType()
export class Stock {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => Int)
    modelYear: number;

    @Field(() => Int)
    price: number;

    @Field(() => Int, { nullable: true })
    mileage?: number;

    @Field(() => String)
    clientId: string;

    /* ───────── 追加フィールド ───────── */
    @Field(() => Int)
    priceWithTax: number;      // = price * 1.1
    /* ────────────────────────────── */

    @Field(() => Client)
    client: Client;

    @Field(() => [Photo])
    photos: Photo[];

    @Field(() => PurchaseInfo, { nullable: true })
    purchaseInfo?: PurchaseInfo;

}
