import {
    Resolver,
    Query,
    Args,
    Parent,
    ResolveField,
} from '@nestjs/graphql';
import { Stock } from './stock.model';
import { StockService } from './stock.service';
import { Client } from '../client/client.model';
import { Photo } from '../photo/photo.model';
import { ClientRecord, PhotoRecord, PurchaseInfoRecord, purchaseInfos, StockRecord } from '../mock-data';
import { Logger } from '@nestjs/common';
import { PurchaseInfo } from '../purchase-info/purchase-info.model';
import { ClientLoader } from '../client/client.loader';
import { PhotoService } from '../photo/photo.service';
import { PurchaseInfoService } from '../purchase-info/purchase-info.service';

const log = new Logger('StockResolver');

@Resolver(() => Stock)
export class StockResolver {
    constructor(
        private readonly stockSvc: StockService,
        private readonly clientLoader: ClientLoader,
        private readonly photoSvc: PhotoService,
        private readonly purchaseInfoSvc: PurchaseInfoService,
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
    async client(@Parent() stock: Stock): Promise<ClientRecord> {
        log.verbose(`Requesting Client ${stock.clientId} for Stock ${stock.id}`);
        const client = await this.clientLoader.loader.load(stock.clientId);
        return client;
    }

    /** Stock.photos の解決 */
    @ResolveField(() => [Photo])
    photos(@Parent() stock: Stock): PhotoRecord[] {
        // TODO: Dataloader を使ってN+1問題を解決する
        log.verbose(`Fetch Photos for stockId=${stock.id}`);
        return this.photoSvc.findByStock(stock.id);
    }

    /** Stock.purchaseInfo の解決 */
    @ResolveField(() => PurchaseInfo)
    purchaseInfo(@Parent() stock: Stock): PurchaseInfoRecord {
        // TODO: Dataloader を使ってN+1問題を解決する
        log.verbose(`Fetch PurchaseInfo for stockId=${stock.id}`);
        return this.purchaseInfoSvc.findByStock(stock.id);
    }

    /** Stock.priceWithTax の解決 */
    @ResolveField(() => Number)
    priceWithTax(@Parent() stock: Stock): number {
        return Math.round(stock.price * 1.1);
    }
}
