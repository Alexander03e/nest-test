import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from '@app/tag/tag.entity';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('array')
  async getArray(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();

    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  @Get(':id')
  async findOne(@Param() params) {
    const { id } = params;
    return await this.tagService.findOne({ id });
  }

  @Get()
  async findAll(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }
}
