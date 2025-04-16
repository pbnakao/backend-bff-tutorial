import {
    Resolver,
    Query,
    Args,
    Parent,
    ResolveField,
} from '@nestjs/graphql';
import { Stock } from './stock.model';
import { StockService } from './stock.service';
import { ClientService } from '../client/client.service';
import { PhotoService } from '../photo/photo.service';
import { Client } from '../client/client.model';
import { Photo } from '../photo/photo.model';
import { ClientRecord, PhotoRecord, StockRecord } from '../mock-data';

@Resolver(() => Stock)
export class StockResolver {
    constructor(
        private readonly stockSvc: StockService,
        private readonly clientSvc: ClientService,
        private readonly photoSvc: PhotoService,
    ) { }

    /** 在庫一覧を取得（clientId で絞り込み可能） */
    @Query(() => [Stock])
    stocks(
        @Args('clientId', { nullable: true }) clientId?: string,
    ): StockRecord[] {
        return this.stockSvc.findByClient(clientId);
    }

    /** Stock.client の解決 */
    @ResolveField(() => Client)
    client(@Parent() stock: Stock): ClientRecord {
        return this.clientSvc.findById(stock.clientId);
    }

    /** Stock.photos の解決 */
    @ResolveField(() => [Photo])
    photos(@Parent() stock: Stock): PhotoRecord[] {
        return this.photoSvc.findByStock(stock.id);
    }

    /** Stock.priceWithTax の解決 */
    @ResolveField(() => Number)
    priceWithTax(@Parent() stock: Stock): number {
        return Math.round(stock.price * 1.1);
    }
}
