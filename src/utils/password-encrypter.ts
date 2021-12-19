import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordEncrypter {
  static encrypt(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  static compare(password: string, passwordEncrypted: string) {
    return bcrypt.compareSync(password, passwordEncrypted);
  }
}
