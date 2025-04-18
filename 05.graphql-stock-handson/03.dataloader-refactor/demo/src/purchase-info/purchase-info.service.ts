import { Injectable, Logger } from '@nestjs/common';
import { purchaseInfos, PurchaseInfoRecord } from '../mock-data';

@Injectable()
export class PurchaseInfoService {
    private readonly logger = new Logger(PurchaseInfoService.name);

    /** stockId で 1 件取得（なければ undefined） */
    findByStock(stockId: string): PurchaseInfoRecord | undefined {
        return purchaseInfos.find((p) => p.stockId === stockId);
    }

    /** stockId[] に対する PurchaseInfo 一括取得（DataLoader 用） */
    findByStockIds(stockIds: string[]): PurchaseInfoRecord[] {
        this.logger.verbose(`📦 findByStockIds called with stockIds = [${stockIds.join(', ')}]`);
        return purchaseInfos.filter((p) => stockIds.includes(p.stockId));
    }
}
