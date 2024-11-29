import { Test, TestingModule } from '@nestjs/testing';
import { ResidentResolver } from './resident.resolver';

describe('ResidentResolver', () => {
  let resolver: ResidentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResidentResolver],
    }).compile();

    resolver = module.get<ResidentResolver>(ResidentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
