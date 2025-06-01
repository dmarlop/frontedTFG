import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clonamos la petición y le añadimos el header Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${environment.authToken}`
      }
    });
    return next.handle(authReq);
  }
}
