// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';

import { UserComponent } from './components/user/user.component';
import { CustomerComponent } from './components/customer/customer.component';
//import { OfferComponent } from './components/offer/offer.component';
import { DocumentFileComponent } from './components/document-file/document-file.component';
//import { InstallationRequestComponent } from './components/installation-request/installation-request.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeviceComponent } from './components/device/device.component';
import { ServicingComponent } from './components/servicing/servicing.component';
import { DutyComponent } from './components/duty/duty.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { loginGuard } from './guards/login.guard';

import { ILanguage } from '../assets/locales/ILanguage';
import { Languages } from '../assets/locales/language';
import { AgreementsComponent } from './components/agreements/agreements.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChartsComponent } from './components/charts/charts.component';
import { StockComponent } from './components/stock/stock.component';
import { OffersComponent } from './components/offers/offers.component';

// === Locale bootstrap for breadcrumbs (kept as in your file)
let lang: ILanguage | undefined = Languages.lngs.get(localStorage.getItem('lng'));
if (!lang) {
  localStorage.setItem('lng', 'tr');
  lang = Languages.lngs.get(localStorage.getItem('lng'));
}

// --- Auth routes
const authRoutes = [
  { path: 'user-login', component: UserLoginComponent },
  { path: 'user-register', component: UserRegisterComponent },
];

// --- Dashboard (default) route under layout
const dashboardRoutes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [loginGuard],
    data: { breadcrumb: lang?.dashboard },
  },
];

// --- App feature routes under layout
const humanRoutes = [
  { path: 'charts', component: ChartsComponent, canActivate: [loginGuard], data: { breadcrumb: "lang?.users" } },
  { path: 'stocks', component: StockComponent, canActivate: [loginGuard], data: { breadcrumb: "Stok" } },
  { path: 'offers', component: OffersComponent, canActivate: [loginGuard], data: { breadcrumb: "Teklif" } },

  { path: 'user', component: UserComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.users } },
  { path: 'customer', component: CustomerComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.customers } },
  //{ path: 'offer', component: OfferComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.offers } },
  { path: 'document-file', component: DocumentFileComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.documentFiles } },
  //{ path: 'installation-request', component: InstallationRequestComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.installationRequests } },
  { path: 'device', component: DeviceComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.devices } },
  { path: 'servicing', component: ServicingComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.servicings } },
  { path: 'duty', component: DutyComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.servicings } },
  { path: 'agreements', component: AgreementsComponent, canActivate: [loginGuard], data: { breadcrumb: lang?.servicings } },
  { path: 'settings', component: SettingsComponent, canActivate: [loginGuard], data: { breadcrumb: "ayarlar" } },  // keep as-is to match your lang keys
 // keep as-is to match your lang keys

  // ✅ Lazy-loaded calendar page
  {
    path: 'calendar',
    canActivate: [loginGuard],
    data: { breadcrumb: 'Takvim' }, // or lang?.calendar if you have it
    loadComponent: () =>
      import('./components/calendar/calendar.component').then(m => m.CalendarComponent),
  },
];

// --- 404s
const notFoundRoute = { path: '404', component: NotFoundComponent };
const redirectToNotFound = { path: '**', redirectTo: '/404' };

// === Exported routes
export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    component: LayoutComponent,
    children: [
      ...dashboardRoutes,
      ...humanRoutes,
    ],
  },
  notFoundRoute,
  redirectToNotFound,
];
