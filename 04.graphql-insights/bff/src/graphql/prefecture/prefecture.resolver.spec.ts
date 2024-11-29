import { Test, TestingModule } from '@nestjs/testing';
import { PrefectureResolver } from './prefecture.resolver';

describe('PrefectureResolver', () => {
  let resolver: PrefectureResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefectureResolver],
    }).compile();

    resolver = module.get<PrefectureResolver>(PrefectureResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
