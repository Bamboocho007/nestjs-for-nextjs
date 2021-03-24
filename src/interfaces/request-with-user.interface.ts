import { Request } from 'express';
import { User } from 'src/users/models/user.model';

export interface RequestWithUser extends Request {
  user: User;
}
