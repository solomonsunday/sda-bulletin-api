export interface IUser {
  id?: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export interface ICurrentUser extends Omit<IUser, 'password'> {}
