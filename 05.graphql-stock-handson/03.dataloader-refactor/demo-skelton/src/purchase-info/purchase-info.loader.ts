import * as DataLoader from 'dataloader';
import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class PurchaseInfoLoader {
    private readonly logger = new Logger(PurchaseInfoLoader.name);

    // TODO: client.loader.tsを参考に、バッチ関数を実装する
}