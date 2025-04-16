import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Client } from './client.model';
import { ClientService } from './client.service';
import { ClientRecord } from '../mock-data';

@Resolver(() => Client)
export class ClientResolver {
    constructor(private readonly clientSvc: ClientService) { }

    /** client(id) : 単体取得 */
    @Query(() => Client, { nullable: true })
    client(@Args('id') id: string): ClientRecord | undefined {
        // TODO: ClientService を使って 1 件取得
        return undefined as any;
    }

    /** clients : 一覧取得 */
    @Query(() => [Client])
    clients(): ClientRecord[] {
        // TODO: ClientService を使って全件取得
        return [] as any;
    }

    /** displayName : 都道府県付き名称を生成 */
    @ResolveField(() => String)
    displayName(@Parent() client: Client): string {
        // TODO: client.address から都道府県を抜き出して表示名を作る　例：東京店（東京都）
        return '';
    }
}
