import { UserDTO } from '../domain/entities/types';

export const convertUserToDTO = (user: any): UserDTO => ({
  id: user.id || user._id,
  name: user.name || user._name,
  email: user.email || user._email,
  balance: user.balance || user._balance
});
