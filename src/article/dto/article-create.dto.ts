import { IsNotEmpty } from 'class-validator';

export class ArticleCreateDto {
  @IsNotEmpty()
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList?: string[];
}
