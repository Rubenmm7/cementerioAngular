import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// JWT Interceptor para añadir el token a las peticiones HTTP
export function JwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  
  //No tocar auth
  if (req.url.includes('/api/auth')) {
    return next(req);
  }

  //Leer token
  const token = localStorage.getItem('token');

  //Añadir Authorization si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
}


