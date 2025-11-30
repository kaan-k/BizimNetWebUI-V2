import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Import NavigationEnd
import { filter } from 'rxjs/operators';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { LanguageComponentService } from '../../services/component/language-component.service';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { User } from '../../models/user/user';

// Updated Interface
interface MenuItem {
  link?: string;      // Optional for parent items
  icon: string;
  label: string;
  children?: MenuItem[]; // Nested items
  expanded?: boolean;    // For UI toggle state
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));

  menuItems: MenuItem[] = [];
  user: User | null = null;
  userName: string = 'Yükleniyor...';
  userRoleText: string = 'Kullanıcı';
  isMobileMenuOpen: boolean = false;
  viewportWidth: number = window.innerWidth;

  constructor(
    private languageComponentService: LanguageComponentService,
    private userComponentService: UserComponentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();

    // --- DEFINING THE MENU STRUCTURE ---
    this.menuItems = [
      { link: '/', icon: 'fa-solid fa-table-columns', label: this.lang.dashboard },
      { link: '/charts', icon: 'fa-solid fa-chart-pie', label: 'Tablolar' },
      
      // PARENT ITEM: Cariler
      { 
        label: this.lang.customers, // "Cariler"
        icon: 'fa-solid fa-building',
        expanded: false, // Default closed
        children: [
          { link: '/customer', icon: 'fa-solid fa-list', label: 'Müşteri Listesi' },
          { link: '/offers', icon: 'fa-solid fa-file-invoice-dollar', label: this.lang.offers },
          { link: '/agreements', icon: 'fa-solid fa-handshake', label: 'Sözleşmeler' }
        ]
      },

      { link: '/stocks', icon: 'fa-solid fa-server', label: "Stoklar" },
      { link: '/duty', icon: 'fa-solid fa-list-check', label: this.lang.duties },
      { link: '/document-file', icon: 'fa-solid fa-file', label: this.lang.documentFiles },
      { link: '/user', icon: 'fa-solid fa-users', label: this.lang.users },
      { link: '/settings', icon: 'fa-solid fa-gear', label: 'Ayarlar' },
    ];

    // Check initial route to auto-expand menus if user refreshes page on a sub-route
    this.checkActiveRoute(this.router.url);

    // Listen to route changes to keep sidebar state in sync
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkActiveRoute(event.urlAfterRedirects);
    });
  }

  // --- LOGIC ---

  // Toggles the sub-menu visibility
  toggleSubMenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  // Checks if a parent should be expanded based on current URL
  checkActiveRoute(url: string) {
    this.menuItems.forEach(item => {
      if (item.children) {
        // If any child link matches the current URL, expand the parent
        const isActiveChild = item.children.some(child => url.includes(child.link!));
        if (isActiveChild) {
          item.expanded = true;
        }
      }
    });
  }

  // Helper to check if a specific item is active (for styling parents)
  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.router.isActive(child.link!, false));
  }

  async loadUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.user = await this.userComponentService.getById(userId);
      if (this.user) {
        this.userName = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim();
        this.userRoleText = this.user.isAuthorised === true ? 'Yönetici' : 'Kullanıcı';
      }
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.classList.remove('no-scroll');
    }
  }

  Logout() {
    localStorage.clear();
    this.router.navigate(['/user-login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.viewportWidth = event.target.innerWidth;
    if (this.viewportWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}