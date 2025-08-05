import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage'; 
import { Languages } from '../../../assets/locales/language'; 

@Component({
  selector: 'app-navbar-duty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-duty.component.html',
  styleUrl: './navbar-duty.component.css'
})
export class NavbarDutyComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"));

}
