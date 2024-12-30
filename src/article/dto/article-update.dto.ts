export class ArticleUpdateDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList?: string[];
}
