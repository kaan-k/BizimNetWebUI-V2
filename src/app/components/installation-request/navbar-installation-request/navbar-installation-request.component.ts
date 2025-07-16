import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

@Component({
  selector: 'app-navbar-installation-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-installation-request.component.html',
  styleUrl: './navbar-installation-request.component.css'
})
export class NavbarInstallationRequestComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
}
