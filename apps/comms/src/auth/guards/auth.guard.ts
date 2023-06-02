import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Validate the request to having a correct jwt

    const aid = request.cookies['aid'];

    if (!aid) throw new UnauthorizedException();

    try {
      const user = verify(aid, this.configService.get<string>('JWTSECRET'));
      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
