import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUser } from './dto/new-user';

import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private _usersRepository: Repository<User>,
  ) {}

  public findAll() {
    return this._usersRepository.find();
  }

  public findById(id: number) {
    return this._usersRepository.findOne({ id });
  }

  public findByEmail(email: string) {
    return this._usersRepository.findOne({ email });
  }

  public async add(data: NewUser) {
    const inserted = await this._usersRepository.insert(data);
    const id = inserted.identifiers[0].id;
    return this._usersRepository.findOne({ id });
  }

  public remove(id: number) {
    return this._usersRepository.delete({ id });
  }
}
