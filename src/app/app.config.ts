import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import { routes } from './app.routes';

import { CalendarDateFormatter, DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateFormatter } from './core/datetime/datetime-picker-component';

registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),

    // ✅ Locale
    { provide: LOCALE_ID, useValue: 'tr-TR' },

    // ✅ Angular Calendar 24-hour setup
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ],
};
