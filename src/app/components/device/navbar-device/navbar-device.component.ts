import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

@Component({
  selector: 'app-navbar-device',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-device.component.html',
  styleUrl: './navbar-device.component.css'
})
export class NavbarDeviceComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"));
}
