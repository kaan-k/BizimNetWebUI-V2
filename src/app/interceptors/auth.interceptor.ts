import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  let headers: Record<string, string> = {};
  if (token)  headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;

  const cloned = Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req;
  return next(cloned);
};
