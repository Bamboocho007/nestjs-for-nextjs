import { User } from '../models/user.model';

export class NewUser {
  name: string;
  email: string;
  password: string;
}

export class NewUserForm extends NewUser {
  passwordConfirm: string;
}

export type UserForRequest = Omit<User, 'password'>;
