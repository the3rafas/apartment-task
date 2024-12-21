import { Injectable } from '@nestjs/common';
import { IDataLoaderService } from './dataloader.interface';

@Injectable()
export class DataloaderService implements IDataLoaderService {
  constructor() {}

  createLoaders() {}
}
