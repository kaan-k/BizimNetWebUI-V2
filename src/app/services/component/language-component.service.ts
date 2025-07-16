import { Injectable } from '@angular/core';
import { LanguageService } from '../common/language.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageComponentService {

  constructor(private languageService:LanguageService) { }

  async setLanguage(routingKey:string){
    const observable =this.languageService.setLanguage(routingKey)
    return (await firstValueFrom(observable))
  }
}
