import { EntityRepository, Repository } from 'typeorm';
import { Seeker } from './seeker.entity';

@EntityRepository(Seeker)
export class SeekerRepository extends Repository<Seeker> {
}
