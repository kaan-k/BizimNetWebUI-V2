import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-page-name-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-name-card.component.html',
  styleUrl: './page-name-card.component.css'
})
export class PageNameCardComponent {
  
 lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
 breadCrum: string;
 

  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    // Sayfa yüklendiğinde getPageName() metodunu çağır
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.snapshot.root;
        this.breadCrum = this.getBreadcrumb(currentRoute);
      }
    });
  }
  private getBreadcrumb(route: ActivatedRouteSnapshot): string {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data["breadcrumb"];  
  }
}
