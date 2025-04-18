import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PurchaseInfo } from './purchase-info.model';
import { purchaseInfos, PurchaseInfoRecord } from '../mock-data';
import { SupplierService } from '../supplier/supplier.service';
import { Supplier } from '../supplier/supplier.model';

@Resolver(() => PurchaseInfo)
export class PurchaseInfoResolver {
    constructor(private readonly supplierSvc: SupplierService) { }

    /** purchaseInfo(stockId) : 在庫に紐づく仕入情報を 1 件取得 */
    @Query(() => PurchaseInfo, { nullable: true })
    purchaseInfo(@Args('stockId') stockId: string): PurchaseInfo | undefined {
        const row = purchaseInfos.find((p) => p.stockId === stockId);
        return row ? this.toModel(row) : undefined;
    }

    /* ---------- Field Resolver ---------- */

    /** supplier : Supplier Entity に載せ替え */
    @ResolveField(() => Supplier)
    supplier(@Parent() info: PurchaseInfo): Supplier {
        // supplierName + supplierPhone をキーに検索
        return (
            this.supplierSvc.findByNamePhone(
                info.supplierName,
                info.supplierPhone,
            ) ?? {
                /* Supplier が見つからない場合のフォールバック */
                name: info.supplierName,
                phone: info.supplierPhone,
            }
        );
    }

    /* ---------- 内部変換 ---------- */

    private toModel(row: PurchaseInfoRecord): PurchaseInfo {
        return {
            purchaseDate: row.purchaseDate,
            supplier: undefined as any, // Field Resolver で解決
            stockId: row.stockId,
            clientId: row.clientId,
            supplierName: row.supplierName,
            supplierPhone: row.supplierPhone,
        };
    }
}
