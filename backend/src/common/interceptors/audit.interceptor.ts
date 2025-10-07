import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { AuditService } from '../../audit/audit.service';
import {
  AuditAction,
  AuditEntityType,
  RequestSource,
} from '../enums/audit.enums';

export interface AuditMetadata {
  action: AuditAction;
  entityType: AuditEntityType;
  description: string;
  entityId?: string;
}

export function Audit(
  action: AuditAction,
  entityType: AuditEntityType,
  description: string,
  entityId?: string,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(
      'audit',
      { action, entityType, description, entityId },
      descriptor.value,
    );
  };
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject(AuditService) private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const auditMetadata: AuditMetadata = Reflect.getMetadata('audit', handler);

    if (auditMetadata) {
      const startTime = Date.now();
      const ipAddress = this.getClientIp(request);
      const userAgent = request.headers['user-agent'];
      const userId = request.user?.id || null;

      return next.handle().pipe(
        tap(async (result) => {
          try {
            // Success case
            const entityId =
              auditMetadata.entityId ||
              this.extractEntityId(result, auditMetadata.entityType);
            await this.auditService.createAuditLog({
              userId,
              ipAddress,
              userAgent,
              action: auditMetadata.action,
              entityType: auditMetadata.entityType,
              entityId,
              description: auditMetadata.description,
              success: true,
              source: RequestSource.USER,
            });
          } catch (error) {
            // Don't let audit logging break the main operation
            console.error('Audit logging failed:', error);
          }
        }),
        catchError(async (error) => {
          try {
            // Error case
            await this.auditService.createAuditLog({
              userId,
              ipAddress,
              userAgent,
              action: auditMetadata.action,
              entityType: auditMetadata.entityType,
              description: auditMetadata.description,
              success: false,
              errorMessage: error.message,
              source: RequestSource.USER,
            });
          } catch (auditError) {
            // Don't let audit logging break the main operation
            console.error('Audit logging failed:', auditError);
          }
          throw error;
        }),
      );
    }

    return next.handle();
  }

  private getClientIp(request: any): string | undefined {
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip']
    );
  }

  private extractEntityId(
    result: any,
    entityType: AuditEntityType,
  ): string | undefined {
    if (!result) return undefined;

    // Try common patterns for extracting entity ID
    if (result.id) return result.id;
    if (result.data?.id) return result.data.id;
    if (result.userId) return result.userId;
    if (result.propertyId) return result.propertyId;
    if (result.contractId) return result.contractId;

    // For arrays, return undefined (entity ID not applicable)
    if (Array.isArray(result)) return undefined;

    return undefined;
  }
}
