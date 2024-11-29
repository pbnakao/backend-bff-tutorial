import { Test, TestingModule } from '@nestjs/testing';
import { PrefecturesResolver } from './prefectures.resolver';

describe('PrefecturesResolver', () => {
  let resolver: PrefecturesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefecturesResolver],
    }).compile();

    resolver = module.get<PrefecturesResolver>(PrefecturesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
