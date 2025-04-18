import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Supplier } from './supplier.model';
import { SupplierService } from './supplier.service';
import { PurchaseInfo } from '../purchase-info/purchase-info.model';

@Resolver(() => Supplier)
export class SupplierResolver {
    constructor(private readonly supplierSvc: SupplierService) { }

    @Query(() => [Supplier])
    suppliers(): Supplier[] {
        return this.supplierSvc.findAll();
    }

    @ResolveField(() => Supplier)
    supplier(@Parent() info: PurchaseInfo): Supplier {
        return (
            this.supplierSvc.findByNamePhone(
                info.supplierName,
                info.supplierPhone,
            ) ?? { name: info.supplierName, phone: info.supplierPhone }
        );
    }
}
