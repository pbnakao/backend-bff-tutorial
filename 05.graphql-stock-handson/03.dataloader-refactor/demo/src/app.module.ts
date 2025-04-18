import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StockModule } from './stock/stock.module';
import { ClientModule } from './client/client.module';
import { PhotoModule } from './photo/photo.module';
import { ApolloDriver } from '@nestjs/apollo';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseInfoModule } from './purchase-info/purchase-info.module';

@Module({
    imports: [
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: true,
        }),
        StockModule,
        ClientModule,
        PhotoModule,
        SupplierModule,
        PurchaseInfoModule
    ],
})
export class AppModule { }
