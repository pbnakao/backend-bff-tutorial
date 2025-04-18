import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { ClientLoader } from './client.loader';

@Module({
    providers: [ClientService, ClientResolver, ClientLoader],
    exports: [ClientService, ClientLoader],  // StockResolver などで DI できるようにエクスポート
})
export class ClientModule { }
