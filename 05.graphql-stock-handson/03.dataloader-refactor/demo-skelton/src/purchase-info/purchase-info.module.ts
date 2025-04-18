import { Module } from '@nestjs/common';
import { PurchaseInfoResolver } from './purchase-info.resolver';
import { SupplierModule } from '../supplier/supplier.module';
import { PurchaseInfoService } from './purchase-info.service';
import { PurchaseInfoLoader } from './purchase-info.loader';

@Module({
    imports: [SupplierModule],
    providers: [PurchaseInfoResolver, PurchaseInfoService, PurchaseInfoLoader],
    exports: [PurchaseInfoService, PurchaseInfoLoader], // StockResolver で DI するため
})
export class PurchaseInfoModule { }
