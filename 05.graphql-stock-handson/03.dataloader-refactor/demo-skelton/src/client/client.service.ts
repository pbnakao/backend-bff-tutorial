import { Injectable, Logger } from '@nestjs/common';
import { clients, ClientRecord } from '../mock-data';

@Injectable()
export class ClientService {
    private readonly logger = new Logger(ClientService.name);

    /** ID で 1 件取得（なければ undefined） */
    findById(id: string): ClientRecord | undefined {
        return clients.find((c) => c.id === id);
    }

    /** ID で複数件取得 */
    findByIds(ids: string[]): ClientRecord[] {
        this.logger.verbose(`🔍 findByIds called with ids = [${ids.join(', ')}]`);
        return this.findAll().filter((client) => ids.includes(client.id));
    }

    /** 全件取得 */
    findAll(): ClientRecord[] {
        return clients;
    }
}
