import { Injectable } from '@nestjs/common';
import { purchaseInfos, PurchaseInfoRecord } from '../mock-data';

@Injectable()
export class PurchaseInfoService {
    /** stockId で 1 件取得（なければ undefined） */
    findByStock(stockId: string): PurchaseInfoRecord | undefined {
        return purchaseInfos.find((p) => p.stockId === stockId);
    }
}
