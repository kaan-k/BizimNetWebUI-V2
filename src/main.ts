import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app/app.routes';
import { customHttpInterceptor } from './app/services/http/http-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    provideToastr({
      timeOut: 1000,
      preventDuplicates: false,
      closeButton: true,
      countDuplicates: true,
      positionClass: "toast-bottom-right",
    }),
    provideAnimations(),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            var token = localStorage.getItem("token");
            return token;
          },
          allowedDomains: window["env"]["allowedDomains"],
        },
      }),
    ]),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi(),withInterceptors([customHttpInterceptor])),
  ],
});
