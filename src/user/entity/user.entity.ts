import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  //Будет вызвана до того, как сущность будет вставлена в базу данных
  @BeforeInsert()
  async hashPassword() {
    // salt - 10
    this.password = await hash(this.password, 10);
  }
}