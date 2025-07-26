import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Languages } from '../../../../assets/locales/language';
import { ILanguage } from '../../../../assets/locales/ILanguage';

@Component({
  selector: 'app-navbar-document-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-document-file.component.html',
  styleUrl: './navbar-document-file.component.css'
})
export class NavbarDocumentFileComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
}
