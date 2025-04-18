import * as DataLoader from 'dataloader';
import { Injectable, Scope, Logger } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientRecord } from '../mock-data';

@Injectable({ scope: Scope.REQUEST })
export class ClientLoader {
    private readonly logger = new Logger(ClientLoader.name);

    constructor(private readonly clientService: ClientService) { }

    readonly loader = new DataLoader<string, ClientRecord>(async (ids) => {
        this.logger.verbose(`🔄 batchFn called with ids: [${ids.join(', ')}]`);

        // 1. まとめて client 情報を取得（例: WHERE id IN (...) 相当）
        const clients = this.clientService.findByIds(ids as string[]);

        // 2. 取得した clients を Map に変換して、id で即座に引けるようにする
        const clientMap = new Map(clients.map((c) => [c.id, c]));

        // 3. 元の ids の順番通りに、client を返す（DataLoader の仕様に準拠）
        return ids.map((id) => clientMap.get(id));
    });
}
