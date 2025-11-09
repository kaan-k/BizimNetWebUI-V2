import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Customer } from '../../models/customers/cusotmers';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { CustomerDto } from '../../models/customers/customerDto';
import { agGridPersistSettings } from '../../models/agGrid/agGridPersistSettings';
import { agGridPersistSettingsDto } from '../../models/agGrid/agGridPersistSettingsDto';

@Injectable({
  providedIn: 'root'
})
export class AgGridSettings extends BizimNetHttpClientService {

  private _controller = "AgGridSettings";

  addSetting(agGridPersistSettings: agGridPersistSettingsDto, p0: () => void) {
    const observable = this.post<ResponseModel | agGridPersistSettingsDto>({ controller: this._controller, action: "Add" }, agGridPersistSettings) as Observable<ResponseModel>
    return observable
  }

  updateCustomer(customer: Customer) {
    const observable = this.post<ResponseModel | Customer>({ controller: this._controller, action: "Update" }, customer) as Observable<ResponseModel>
    return observable
  }
  async deleteCustomer(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<Customer>>({ controller: this._controller, action: "GetAll" })
  }
  getById(id: string) {
    return this.get<SingleResponseModel<Customer>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }
  getByAllById(id: string) {
    return this.get<SingleResponseModel<Customer>>({ controller: this._controller, action: "GetAllByCustomer", queryString: `id=${id}` })
  }
}
