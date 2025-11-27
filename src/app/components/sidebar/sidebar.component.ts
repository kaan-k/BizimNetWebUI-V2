import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { LanguageComponentService } from '../../services/component/language-component.service';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { UserDetailsDto } from '../../models/user/userDetailsDto';
import { User } from '../../models/user/user';

// Define the structure for menu items
interface MenuItem {
  link: string;
  icon: string;
  label: string;
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
  isUserAdmin: boolean = false;
  userRoleText: string = 'Kullanıcı';

  // --- Minimal mobile-only state ---
  isMobileMenuOpen: boolean = false;

  // Optional: keep track of viewport width so we can auto-close on resize to desktop
  viewportWidth: number = window.innerWidth;

  constructor(
    private languageComponentService: LanguageComponentService,
    private userComponentService: UserComponentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();

    this.menuItems = [
      { link: '/', icon: 'fa-solid fa-table-columns', label: this.lang.dashboard },
      { link: '/charts', icon: 'fa-solid fa-chart-pie', label: 'Tablolar' },
      { link: '/user', icon: 'fa-solid fa-users', label: this.lang.users },
      //{ link: '/offer', icon: 'fa-solid fa-envelope', label: this.lang.offers },
      { link: '/duty', icon: 'fa-solid fa-list-check', label: this.lang.duties },
      { link: '/document-file', icon: 'fa-solid fa-file', label: this.lang.documentFiles },
      //{ link: '/installation-request', icon: 'fa-solid fa-code-pull-request', label: this.lang.installationRequests },
      { link: '/customer', icon: 'fa-solid fa-building', label: this.lang.customers },
      //{ link: '/device', icon: 'fa-solid fa-server', label: this.lang.devices },
      //{ link: '/servicing', icon: 'fa-solid fa-screwdriver-wrench', label: this.lang.servicings },
      { link: '/agreements', icon: 'fa-solid fa-handshake', label: 'Anlaşmalar' },
      { link: '/settings', icon: 'fa-solid fa-gear', label: 'Ayarlar' },
    ];
  }

  async loadUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Assuming getById returns the UserDetailsDto with name fields
      this.user = await this.userComponentService.getById(userId);
      if (this.user) {
        // Prefer Name + Surname, fallback to Email
        this.userName = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim();
        console.log(this.user.isAuthorised);
        if (this.user.isAuthorised === true) {
                this.userRoleText = 'Yönetici';
            } else {
                this.userRoleText = 'Kullanıcı';
            }
      }
    }
  }

  // Toggle only for mobile
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // prevent body scroll when open
    if (this.isMobileMenuOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
  }

  // Close mobile menu (useful when a nav link is clicked)
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

  changeLanguage(language: string) {
    localStorage.setItem('lng', language);
    this.languageComponentService.setLanguage(language);
    window.location.reload();
  }

  // Auto-close mobile menu if viewport resized to desktop
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.viewportWidth = event.target.innerWidth;
    if (this.viewportWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
