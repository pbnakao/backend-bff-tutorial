import { Test, TestingModule } from '@nestjs/testing';
import { CityResolver } from './city.resolver';

describe('CityResolver', () => {
  let resolver: CityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityResolver],
    }).compile();

    resolver = module.get<CityResolver>(CityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
