import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

export interface AuditMetadata {
  action: string;
  entity: string;
  description: string;
}

export function Audit(action: string, entity: string, description: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('audit', { action, entity, description }, descriptor.value);
  };
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const auditMetadata: AuditMetadata = Reflect.getMetadata('audit', handler);

    if (auditMetadata) {
      const startTime = Date.now();
      const ip = request.ip || request.connection?.remoteAddress || 'unknown';
      const userAgent = request.headers['user-agent'] || 'unknown';

      return next.handle().pipe(
        tap((result) => {
          // Login successful
          const userId = result?.userId || 'unknown';
          console.log(`[AUDIT] ${new Date().toISOString()} - SUCCESS - ${auditMetadata.action} - ${auditMetadata.entity} - User: ${userId} - IP: ${ip} - ${auditMetadata.description}`);
        }),
        catchError((error) => {
          // Login failed
          const email = request.body?.email || 'unknown';
          const errorMessage = error instanceof UnauthorizedException ? 'Invalid credentials' : error.message;
          console.log(`[AUDIT] ${new Date().toISOString()} - FAILED - ${auditMetadata.action} - ${auditMetadata.entity} - Email: ${email} - IP: ${ip} - Error: ${errorMessage} - ${auditMetadata.description}`);

          throw error;
        })
      );
    }

    return next.handle();
  }
}