import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && user.authenicate(password)) {
      const { password, role, ...result } = user;
      const obj = result as any;
      obj.role = user.role.code;
      return obj;
    }
    return null;
  }

  async login(user: any) {
    const { ...data } = user;
    return {
      data,
      access_token: this.jwtService.sign(user),
    };
  }

  renew(user: any) {
    const { iat, exp, ...data } = user;
    return {
      data,
      access_token: this.jwtService.sign(data),
    };
  }
}
