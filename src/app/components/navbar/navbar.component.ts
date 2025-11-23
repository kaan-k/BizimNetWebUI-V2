import { CommonModule } from '@angular/common';
import { Component, Renderer2, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { Languages } from '../../../assets/locales/language';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { UserDetailsDto } from '../../models/user/userDetailsDto'; 
import { LanguageComponentService } from '../../services/component/language-component.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  user: UserDetailsDto | null = null;
  breadCrum: string = '';
  userName: string = '';
  isSidebarOpen: boolean = true;
  
  // Image paths
  imagePath: string | null = null;
  employeeImagePath: string | null = null;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private userComponentService: UserComponentService,
    private languageComponentService: LanguageComponentService,
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    
    // Breadcrumb Logic
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      this.breadCrum = this.getBreadcrumb(root);
    });
  }

  async loadUserData() {
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.user = await this.userComponentService.getById(userId);
      // Map properties for the UI
      if (this.user) {
        this.userName = this.user.email
      }
    }
  }

  // Getter for clean HTML
  get safeUserImage(): string {
    const baseUrlUser = window["env"]?.["userImage"] || '';
    const baseUrlEmp = window["env"]?.["employeeImage"] || '';

    if (this.imagePath) return baseUrlUser + this.imagePath;
    if (this.employeeImagePath) return baseUrlEmp + this.employeeImagePath;
    
    return "assets/img/noimage.jpg";
  }

  SidebarShow() {
    const sidebarElement = document.querySelector('.hk-nav');
    const wrapperElement = document.querySelector('.main-element'); // Assuming this is your content wrapper

    if (sidebarElement && wrapperElement) {
      if (this.isSidebarOpen) {
        // Close Sidebar
        this.renderer.setStyle(sidebarElement, 'width', '0');
        this.renderer.setStyle(sidebarElement, 'padding', '0');
        this.renderer.setStyle(sidebarElement, 'overflow', 'hidden'); // clean hide
        this.renderer.setStyle(wrapperElement, 'width', '100%');
        this.renderer.setStyle(wrapperElement, 'margin-left', '0'); // Ensure it stretches
      } else {
        // Open Sidebar
        this.renderer.setStyle(sidebarElement, 'width', '280px'); // Match CSS var
        this.renderer.setStyle(sidebarElement, 'padding', '80px 20px');
        this.renderer.setStyle(wrapperElement, 'width', 'calc(100% - 280px)');
        this.renderer.setStyle(wrapperElement, 'margin-left', '280px');
      }
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  readNotification() {
    const bell = document.getElementById("bell");
    if(bell) bell.classList.remove("bells");
  }

  Logout() {
    localStorage.clear(); // Clears all items (token, userId, etc)
    this.router.navigate(["/user-login"]);
  }

  private getBreadcrumb(route: any): string {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data?.["breadcrumb"] || '';  
  }
}