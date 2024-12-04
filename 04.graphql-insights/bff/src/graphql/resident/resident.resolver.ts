import { Resolver } from '@nestjs/graphql';
import { Resident } from './models/resident.model';

@Resolver(() => Resident)
export class ResidentResolver { }
