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
        return this.clientSvc.findById(id);
    }

    /** clients : 一覧取得 */
    @Query(() => [Client])
    clients(): ClientRecord[] {
        return this.clientSvc.findAll();
    }

    @ResolveField(() => String)
    displayName(@Parent() client: Client): string {
        const pref = client.address?.slice(0, 3) ?? '';
        return `${client.name}（${pref}）`;
    }
}
