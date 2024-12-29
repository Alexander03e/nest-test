import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  database: 'mediumclone',
  password: 'admin',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // позже убрать
  migrationsRun: true,
};
