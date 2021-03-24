import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserForm, UserForRequest } from './dto/new-user';
import { hash } from 'bcrypt';
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

  public async add(data: NewUserForm): Promise<UserForRequest> {
    const passwordHash = await hash(data.password, 10);
    const inserted = await this._usersRepository.insert({
      ...data,
      password: passwordHash,
    });
    const id = inserted.identifiers[0].id;
    const user = await this._usersRepository.findOne({ id });
    const { password, ...userDataForResponse } = user;
    return userDataForResponse;
  }

  public remove(id: number) {
    return this._usersRepository.delete({ id });
  }
}
