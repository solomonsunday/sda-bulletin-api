export interface IUser {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ICurrentUser extends Omit<IUser, 'password'> {}
