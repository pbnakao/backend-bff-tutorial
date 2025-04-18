import { Field, ObjectType } from '@nestjs/graphql';
import { Supplier } from '../supplier/supplier.model';

@ObjectType()
export class PurchaseInfo {
    /* GraphQL に出したいフィールド */
    @Field()
    purchaseDate: string;

    @Field(() => Supplier)
    supplier: Supplier;

    /* ---------- 以下は内部用 ---------- */
    stockId: string;        // FK
    clientId: string;       // FK
    supplierName: string;   // 正規化前の名残
    supplierPhone: string;  // 正規化前の名残
}