import * as DataLoader from 'dataloader';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoRecord } from '../mock-data';

@Injectable({ scope: Scope.REQUEST })
export class PhotoLoader {
    private readonly logger = new Logger(PhotoLoader.name);

    constructor(private readonly photoService: PhotoService) { }

    readonly loader = new DataLoader<string, PhotoRecord[]>(async (stockIds) => {
        this.logger.verbose(`🔄 batchFn called with stockIds: [${stockIds.join(', ')}]`);

        // stockId をまとめて取得（WHERE IN 相当）
        const photos = this.photoService.findByStockIds(stockIds as string[]);

        // stockId → PhotoRecord[] の Map に変換
        const photoMap = new Map<string, PhotoRecord[]>();
        for (const photo of photos) {
            if (!photoMap.has(photo.stockId)) {
                photoMap.set(photo.stockId, []);
            }
            photoMap.get(photo.stockId)?.push(photo);
        }

        // stockIds の順に PhotoRecord[] を返す
        return stockIds.map((id) => photoMap.get(id) ?? []);
    });
}
