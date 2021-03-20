import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserForRequest } from './dto/new-user';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Get('/users')
  public async findAllUsers(): Promise<UserForRequest[]> {
    const users = await this._usersService.findAll();
    return users.map((user) => {
      const { password, ...userForReq } = user;
      return userForReq;
    });
  }

  @Get('/users/:id')
  public async findUserById(@Param('id') id: string): Promise<UserForRequest> {
    const user = await this._usersService.findById(parseInt(id));
    const { password, ...userForReq } = user;
    return userForReq;
  }

  // @Mutation(() => User)
  // public async createUser(@Args('newUserData') newUserData: NewUser) {
  //   return await this._usersService.add(newUserData);
  // }

  @Delete('/users/:id')
  public async removeUser(@Param('id') id: string) {
    return await this._usersService.remove(parseInt(id));
  }
}
