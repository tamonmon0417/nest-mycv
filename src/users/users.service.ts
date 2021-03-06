import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  // business logic here
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // create user entity instance
    // creating user instance enables hooks of entity.
    const user = this.repo.create({ email, password });

    // hooks executed by save()
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  // specific args are not good design
  // attrs: attributes
  // const usersService = new UsersService({} as any);
  // usersService.update(1, { email: 'a' });
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // override properties already there
    Object.assign(user, attrs);

    // hooks executed
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // hooks executed
    return this.repo.remove(user);
  }
}
