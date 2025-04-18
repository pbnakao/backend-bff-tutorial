import { Module } from '@nestjs/common';
import { SupplierResolver } from './supplier.resolver';
import { SupplierService } from './supplier.service';

@Module({
    providers: [SupplierResolver, SupplierService],
    exports: [SupplierService],
})
export class SupplierModule { }
