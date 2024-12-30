import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/entity/article.entity';

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

  @Column({ select: false })
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  //Будет вызвана до того, как сущность будет вставлена в базу данных
  @BeforeInsert()
  async hashPassword() {
    // salt - 10
    this.password = await hash(this.password, 10);
  }
}
