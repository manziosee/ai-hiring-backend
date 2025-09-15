import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id || request.params.applicationId;

    if (!resourceId || !user) {
      return false;
    }

    const resource = this.reflector.get<string>(
      'resource',
      context.getHandler(),
    );

    if (!resource) {
      return true;
    }

    const hasAccess = await this.checkResourceAccess(
      resource,
      resourceId,
      user.id,
      user.role,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this resource');
    }

    return true;
  }

  private async checkResourceAccess(
    resource: string,
    resourceId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    switch (resource) {
      case 'application':
        const application = await this.prisma.application.findUnique({
          where: { id: resourceId },
          include: { job: true },
        });
        return (
          application?.userId === userId ||
          application?.job.createdBy === userId ||
          userRole === 'ADMIN'
        );

      case 'job':
        const job = await this.prisma.job.findUnique({
          where: { id: resourceId },
        });
        return job?.createdBy === userId || userRole === 'ADMIN';

      default:
        return true;
    }
  }
}
