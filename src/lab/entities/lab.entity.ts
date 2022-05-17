import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumnX } from 'src/common/decorator';

@Entity('t_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @CreateDateColumnX()
  create_time: Date;
}

@Entity('t_log')
export class Log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column()
  log_msg: string;

  @CreateDateColumnX()
  create_time: Date;
}
