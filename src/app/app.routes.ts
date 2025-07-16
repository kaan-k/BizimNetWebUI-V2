import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { loginGuard } from './guards/login.guard';
import { ILanguage } from '../assets/locales/ILanguage';
import { Languages } from '../assets/locales/language';
import { LayoutComponent } from './components/layout/layout.component';
import { CustomerComponent } from './components/customer/customer.component';
import { OfferComponent } from './components/offer/offer.component';
import { DocumentFileComponent } from './components/document-file/document-file.component';
import { InstallationRequestComponent } from './components/installation-request/installation-request.component';

var lang:ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

if (lang == undefined) {
  localStorage.setItem("lng","tr")
  lang = Languages.lngs.get(localStorage.getItem("lng"));
}

const authRoutes = [
    { path: "user-login", component: UserLoginComponent },
];


const humanRoutes =[
    { path: "user", component: UserComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.users}},
    { path: "customer", component: CustomerComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.customers}},
    { path: "offer", component: OfferComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.offers}},
    { path: "document-file", component: DocumentFileComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.documentFiles}},
    { path: "installation-request", component: InstallationRequestComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.installationRequests}},
]




const notFoundRoute = { path: '404', component: NotFoundComponent };
const redirectToNotFound = { path: '**', redirectTo: '/404' };

export const routes: Routes = [
    ...authRoutes,
    {
        path: "",
        component: LayoutComponent,
        children: [
            ...humanRoutes,
        ],
    },
    notFoundRoute,
    redirectToNotFound,
];