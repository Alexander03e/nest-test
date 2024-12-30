import { DataSource } from 'typeorm';
import { config } from '@app/ormconfig';

const AppDataSource = new DataSource({
  ...config,
  migrations: ['migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
