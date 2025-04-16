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
        // TODO: StockService を呼び出して一覧を返す
        return [] as any;
    }

    /** Stock.client の解決 */
    @ResolveField(() => Client)
    client(@Parent() stock: Stock): ClientRecord {
        // TODO: stock.clientId を使って Client を取得
        return {} as any;
    }

    /** Stock.photos の解決 */
    @ResolveField(() => [Photo])
    photos(@Parent() stock: Stock): PhotoRecord[] {
        // TODO: stock.id を使って Photo 一覧を取得
        return [] as any;
    }

    // TODO: その他必要なField Resolverを定義する
}
