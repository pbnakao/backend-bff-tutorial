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
        return this.photoSvc.findByStock(stockId);
    }

    @ResolveField(() => String)
    thumbnailUrl(@Parent() photo: Photo): string {
        return `${photo.url}?w=300&h=200&fit=cover`;
    }
}
