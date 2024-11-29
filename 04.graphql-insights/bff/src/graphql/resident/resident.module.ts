import { Module } from '@nestjs/common';
import { ResidentResolver } from './resident.resolver';

@Module({
  providers: [ResidentResolver]
})
export class ResidentModule {}
