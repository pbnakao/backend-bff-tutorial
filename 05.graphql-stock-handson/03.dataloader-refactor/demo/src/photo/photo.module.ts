import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoResolver } from './photo.resolver';
import { PhotoLoader } from './photo.loader';

@Module({
    providers: [PhotoService, PhotoResolver, PhotoLoader],
    exports: [PhotoService, PhotoLoader], // StockResolver で DI できるように
})
export class PhotoModule { }
