import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { Stock } from '../../models/stock/stock'; 
import { StockAddDto } from '../../models/stock/stockAddDto';

@Injectable({
  providedIn: 'root'
})
export class StockService extends BizimNetHttpClientService {

  private _controller = "Stock";

  add(stock: StockAddDto) {
    const observable = this.post<ResponseModel | StockAddDto>({ controller: this._controller, action: "Add" }, stock) as Observable<ResponseModel>
    return observable
  }

  update(stock: Stock) {
    const observable = this.post<ResponseModel | Stock>({ controller: this._controller, action: "Update" }, stock) as Observable<ResponseModel>
    return observable
  }

  async deleteStock(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }

  getByDeviceType(deviceType: number) {
    return this.get<ListResponseModel<Stock>>({ 
      controller: this._controller, 
      action: "GetByDeviceType", 
      queryString: `deviceType=${deviceType}` 
    })
  }

  getAll() {
    return this.get<ListResponseModel<Stock>>({ 
      controller: this._controller, 
      action: "GetAll" 
    });
  }
}