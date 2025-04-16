import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';

@Module({
    providers: [ClientService, ClientResolver],
    exports: [ClientService],  // StockResolver などで DI できるようにエクスポート
})
export class ClientModule { }
