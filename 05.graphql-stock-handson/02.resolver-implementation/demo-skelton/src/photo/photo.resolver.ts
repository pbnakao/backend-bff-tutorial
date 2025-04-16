import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Photo } from './photo.model';
import { PhotoService } from './photo.service';
import { PhotoRecord } from '../mock-data';

@Resolver(() => Photo)
export class PhotoResolver {
    constructor(private readonly photoSvc: PhotoService) { }

    /** photosByStock(stockId) : Stock に紐づく写真一覧 */
    @Query(() => [Photo])
    photosByStock(@Args('stockId') stockId: string): PhotoRecord[] {
        // TODO: PhotoService を使って stockId に紐づく写真を取得
        return [] as any;
    }

    /** thumbnailUrl : CDN サムネイル URL を生成 */
    @ResolveField(() => String)
    thumbnailUrl(@Parent() photo: Photo): string {
        // TODO: photo.url を変換してサムネイル URL を返す（URLの末尾に ?w=300&h=200&fit=cover を付けてください）
        return '';
    }
}
