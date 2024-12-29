import { Injectable } from '@nestjs/common';
import { Tag } from '@app/tag/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async findOne({ id }: Pick<Tag, 'id'>): Promise<Tag> {
    return await this.tagRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }
}
