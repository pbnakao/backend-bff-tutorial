import { Injectable } from '@nestjs/common';
import { photos, PhotoRecord } from '../mock-data';

@Injectable()
export class PhotoService {
    /** stockId に紐づく写真を取得 */
    findByStock(stockId: string): PhotoRecord[] {
        return photos.filter((p) => p.stockId === stockId);
    }

    /** 1 枚取得（例：メイン写真を取りたい場合など） */
    findMainPhoto(stockId: string): PhotoRecord | undefined {
        return photos.find((p) => p.stockId === stockId && p.isMain);
    }
}
