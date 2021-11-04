import { Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  getCurrentUserId(token: string): string {
    return decode(token)?.sub as string;
  }
}
