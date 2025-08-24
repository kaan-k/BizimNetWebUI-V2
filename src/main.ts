// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { JwtModule } from '@auth0/angular-jwt';
import { provideToastr } from 'ngx-toastr';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    provideAnimations(),
    provideToastr({
      timeOut: 1000,
      preventDuplicates: false,
      closeButton: true,
      countDuplicates: true,
      positionClass: 'toast-bottom-right',
    }),

    // Pass modules directly (NOT as an array)
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token'),
          allowedDomains: (window as any)?.env?.allowedDomains ?? [],
        },
      }),
      // angular-calendar wiring
      CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
    ),

    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),

    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
  ],
});
