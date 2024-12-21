import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
