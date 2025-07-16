import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

@Component({
  selector: 'app-navbar-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-offer.component.html',
  styleUrl: './navbar-offer.component.css'
})
export class NavbarOfferComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"));
}
