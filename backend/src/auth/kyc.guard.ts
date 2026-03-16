import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class KycGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user: User = request.user;
    if (!user || user.kycStatus !== 'verified') {
      throw new ForbiddenException({
        code: 'KYC_REQUIRED',
        message: 'KYC verification is required to perform this action.',
      });
    }
    return true;
  }
}
