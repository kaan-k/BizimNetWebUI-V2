import { Injectable } from '@angular/core'; 
import { SingleResponseModel } from '../../models/singleResponseModel';
import { Language } from '../../models/language/language';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends BizimNetHttpClientService {

  _controller="Language"
  setLanguage(routingKey:string){
    return this.get<SingleResponseModel<Language>>({controller:this._controller,action:"SetLanguage",queryString:`language=${routingKey}`})
  }
}
