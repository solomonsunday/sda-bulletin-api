import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '../entities/auth.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof IUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = request.user as IUser;
    if (!currentUser) {
      throw new NotFoundException('User not found!');
    }
    return data ? currentUser?.[data] : currentUser;
  },
);
