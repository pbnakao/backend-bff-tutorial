import { Module } from '@nestjs/common';
import { PurchaseInfoResolver } from './purchase-info.resolver';
import { SupplierModule } from '../supplier/supplier.module';
import { PurchaseInfoService } from './purchase-info.service';

@Module({
    imports: [SupplierModule],
    providers: [PurchaseInfoResolver, PurchaseInfoService],
    exports: [PurchaseInfoService], // StockResolver で DI するため
})
export class PurchaseInfoModule { }
