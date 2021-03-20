import * as DataLoader from 'dataloader';
import { User } from 'src/users/models/user.model';
import { createQueryBuilder } from 'typeorm';

const batchArticles = async (userIds: number[]): Promise<User[]> => {
  const users = await createQueryBuilder<User>('User')
    .where('User.id IN(:...ids)', { ids: userIds })
    .getMany();
  return userIds.map((id) => users.find((user) => user.id === id));
};

const usersLoader = () => new DataLoader(batchArticles);

export { usersLoader };
