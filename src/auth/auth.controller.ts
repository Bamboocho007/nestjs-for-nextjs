import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { NewUserForm } from 'src/users/dto/new-user';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this._authService.login(req.user);
  }

  @Post('auth/registration')
  async registration(@Request() req: Request, @Body() body: NewUserForm) {
    return this._userService.add(body);
  }
}
