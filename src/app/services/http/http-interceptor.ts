import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, throwError } from "rxjs";

export const customHttpInterceptor: HttpInterceptorFn = (req, next) => {
    var toastr = inject(ToastrService);
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 405: error.error.Errors.forEach((element:any) => { toastr.error(element.ErrorMessage); });
              break;
            case 500: toastr.error("Sunucuya bağlanırken bir hata oluştu");
              break;
            case 400: toastr.error(error.error);
              break;
            case 401: toastr.error("Yetkiniz yok");
              break;
            default:
              break;
          }
        }
        return throwError(() => { error.message });
      })
    );
  };