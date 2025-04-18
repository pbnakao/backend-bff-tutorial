import { Injectable, Logger } from '@nestjs/common';
import { photos, PhotoRecord } from '../mock-data';

@Injectable()
export class PhotoService {
    private readonly logger = new Logger(PhotoService.name);

    /** stockId に紐づく写真を取得 */
    findByStock(stockId: string): PhotoRecord[] {
        return photos.filter((p) => p.stockId === stockId);
    }

    /** stockId[] をまとめて取得（DataLoader 用） */
    findByStockIds(stockIds: string[]): PhotoRecord[] {
        this.logger.verbose(`📸 findByStockIds called with stockIds = [${stockIds.join(', ')}]`);
        return photos.filter((p) => stockIds.includes(p.stockId));
    }

    /** 1 枚取得（例：メイン写真を取りたい場合など） */
    findMainPhoto(stockId: string): PhotoRecord | undefined {
        return photos.find((p) => p.stockId === stockId && p.isMain);
    }
}
