import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Log } from './entities/lab.entity';

@Injectable()
export class LabService {
  constructor(
    @InjectRepository(User)
    public readonly mainRepo: Repository<User>,
    @InjectRepository(Log, 'other')
    public readonly logRepo: Repository<Log>,
  ) {}
}
