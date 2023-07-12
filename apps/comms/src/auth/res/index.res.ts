import { UserRes } from 'src/users/res';

export class LoginRes {
  user: UserRes;
  authJWT: string;
}
