import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoResolver } from './photo.resolver';

@Module({
    providers: [PhotoService, PhotoResolver],
    exports: [PhotoService], // StockResolver で DI できるように
})
export class PhotoModule { }
