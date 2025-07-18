import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

@Component({
  selector: 'app-navbar-servicing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-servicing.component.html',
  styleUrl: './navbar-servicing.component.css'
})
export class NavbarServicingComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"))
}
