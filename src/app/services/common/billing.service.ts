import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';
// Assuming these models exist in your project structure
import { Billing } from '../../models/billings/billing';
import { BillingDto } from '../../models/billings/billingDto';

@Injectable({
  providedIn: 'root'
})
export class BillingService extends BizimNetHttpClientService {

  private _controller = "Billing";

  add(billing: BillingDto) {
    const observable = this.post<ResponseModel | BillingDto>({ controller: this._controller, action: "Add" }, billing) as Observable<ResponseModel>
    return observable
  }

  update(billing: Billing, id: string) {
    const observable = this.post<ResponseModel | Billing>({ controller: this._controller, action: "Update", queryString: `id=${id}` }, billing) as Observable<ResponseModel>
    return observable
  }

deleteBilling(id: string): Observable<ResponseModel> {
    return this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` });
  }

  getById(id: string) {
    return this.get<SingleResponseModel<Billing>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }

  getAll() {
    return this.get<ListResponseModel<Billing>>({ controller: this._controller, action: "GetAll" })
  }

  // Matches [HttpPost("RecievePay")] public IActionResult RecievePay(string billId,int amount)
  recievePay(billId: string, amount: number) {
    const observable = this.post<ResponseModel>({ 
      controller: this._controller, 
      action: "RecievePay", 
      queryString: `billId=${billId}&amount=${amount}` 
    }, null) as Observable<ResponseModel>
    return observable
  }
}