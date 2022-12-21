import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(partialEntity: Partial<User>) {
    return await this.usersRepository.save(
      this.usersRepository.create(partialEntity),
    );
  }

  findOne(fields: FindOptionsWhere<User>) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  update(id: number, partialEntity: Partial<User>) {
    return this.usersRepository.update(id, partialEntity);
  }

  async softDelete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
