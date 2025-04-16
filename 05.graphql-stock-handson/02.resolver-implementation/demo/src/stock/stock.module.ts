import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockResolver } from './stock.resolver';
import { ClientModule } from '../client/client.module';
import { PhotoModule } from '../photo/photo.module';

@Module({
    imports: [ClientModule, PhotoModule],
    providers: [StockService, StockResolver],
})
export class StockModule { }
