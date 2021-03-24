import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserCredentials } from './dto/user-credentials.dto';
import { User } from 'src/users/models/user.model';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(data: UserCredentials) {
    const user = await this._usersService.findByEmail(data.email);

    if (await compare(data.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = { id: user.id };
    if (!user) {
      throw new NotFoundException();
    }
    return {
      authToken: this._jwtService.sign(payload),
    };
  }
}
