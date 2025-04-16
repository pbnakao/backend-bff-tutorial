import { Injectable } from '@nestjs/common';
import { stocks, StockRecord } from '../mock-data';

@Injectable()
export class StockService {
    /** clientId が渡されれば絞り込み、なければ全件返す */
    findByClient(clientId?: string): StockRecord[] {
        return clientId ? stocks.filter((s) => s.clientId === clientId) : stocks;
    }

    /** ID で 1 件取得（なければ undefined） */
    findById(id: string): StockRecord | undefined {
        return stocks.find((s) => s.id === id);
    }
}
