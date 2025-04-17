import { Injectable } from '@nestjs/common';
import { Supplier } from './supplier.model';
import { purchaseInfos } from '../mock-data';  // PurchaseInfo から生成

@Injectable()
export class SupplierService {
    /** PurchaseInfo から重複のない Supplier 一覧を生成 */
    private readonly supplierList: Supplier[] = this.buildSupplierList();

    /** name + phone の組み合わせで 1 件取得 */
    findByNamePhone(name: string, phone: string): Supplier | undefined {
        return this.supplierList.find(
            (s) => s.name === name && s.phone === phone,
        );
    }

    /** 全件取得 */
    findAll(): Supplier[] {
        return this.supplierList;
    }

    /** ---------------------------------- */
    /** PurchaseInfo → Supplier[] 変換処理 */
    /** ---------------------------------- */
    private buildSupplierList(): Supplier[] {
        const uniqSet = new Map<string, Supplier>();

        purchaseInfos.forEach((p) => {
            const key = `${p.supplierName}-${p.supplierPhone}`;
            if (!uniqSet.has(key)) {
                uniqSet.set(key, {
                    name: p.supplierName,
                    phone: p.supplierPhone,
                });
            }
        });

        return Array.from(uniqSet.values());
    }
}
