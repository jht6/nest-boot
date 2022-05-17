import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Log } from './entities/lab.entity';
import { LabService } from './lab.service';
import { LabController } from './lab.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Log], 'other'),
  ],
  controllers: [LabController],
  providers: [LabService],
})
export class LabModule {}
