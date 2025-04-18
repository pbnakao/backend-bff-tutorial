import * as DataLoader from 'dataloader';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { PurchaseInfoService } from './purchase-info.service';
import { PurchaseInfoRecord } from '../mock-data';

@Injectable({ scope: Scope.REQUEST })
export class PurchaseInfoLoader {
    private readonly logger = new Logger(PurchaseInfoLoader.name);

    constructor(private readonly purchaseInfoService: PurchaseInfoService) { }

    readonly loader = new DataLoader<string, PurchaseInfoRecord | undefined>(async (stockIds) => {
        this.logger.verbose(`🔄 batchFn called with stockIds: [${stockIds.join(', ')}]`);
        const all = this.purchaseInfoService.findByStockIds(stockIds as string[]);
        const map = new Map(all.map((info) => [info.stockId, info]));
        return stockIds.map((id) => map.get(id));
    });
}