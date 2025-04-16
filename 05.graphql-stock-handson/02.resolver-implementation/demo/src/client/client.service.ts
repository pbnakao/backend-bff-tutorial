import { Injectable } from '@nestjs/common';
import { clients, ClientRecord } from '../mock-data';

@Injectable()
export class ClientService {
    /** ID で 1 件取得（なければ undefined） */
    findById(id: string): ClientRecord | undefined {
        return clients.find((c) => c.id === id);
    }

    /** 全件取得 */
    findAll(): ClientRecord[] {
        return clients;
    }
}
