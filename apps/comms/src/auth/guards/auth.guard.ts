import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();

      // Validate the request to having a correct jwt
      const aid = request.headers.aid;

      if (!aid) throw new UnauthorizedException();

      try {
        request['user'] = this.authService.verifyWithJwt(aid);
        return true;
      } catch (error) {
        throw new UnauthorizedException();
      }
    }

    const client = context.switchToWs().getClient();

    // Validate the request to having a correct jwt

    const aid = client.handshake.headers.aid;

    if (!aid) throw new WsException('Unauthorized');
    try {
      client.auth = this.authService.verifyWithJwt(aid);

      return true;
    } catch (error) {
      // TODO: HANDLE ERROR MORE GRACEFULLY
      throw new WsException('Unauthorized');
    }
  }
}
