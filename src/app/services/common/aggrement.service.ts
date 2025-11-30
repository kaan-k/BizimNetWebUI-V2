import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';
// Assuming these models exist based on your naming convention
import { Aggrement } from '../../models/aggrements/aggrement'; 
import { AggrementDto } from '../../models/aggrements/aggrementDto';

@Injectable({
  providedIn: 'root'
})
export class AggrementService extends BizimNetHttpClientService {

  private _controller = "Aggrement";

  addAggrement(aggrement: AggrementDto) {
    const observable = this.post<ResponseModel | AggrementDto>({ controller: this._controller, action: "Add" }, aggrement) as Observable<ResponseModel>
    return observable
  }

  // C# Controller expects 'department' object AND 'departmentId' string. 
  // Assuming the ID needs to be passed in the query string based on the C# signature.
  updateAggrement(aggrement: Aggrement, id: string) {
    const observable = this.post<ResponseModel | Aggrement>({ controller: this._controller, action: "Update", queryString: `id=${id}` }, aggrement) as Observable<ResponseModel>
    return observable
  }

createFromOffer(id: string) {
    const observable = this.post<ResponseModel>({
        controller: this._controller,
        action: "CreateFromOffer", 
        queryString: `offerId=${id}`
    }, {});
    return observable;
  }

  async deleteAggrement(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }

  getById(id: string) {
    return this.get<SingleResponseModel<Aggrement>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }

  getAll() {
    return this.get<ListResponseModel<Aggrement>>({ controller: this._controller, action: "GetAll" })
  }

  // This method corresponds to the unique RecieveBill endpoint
  recieveBill(aggrementId: string, amount: number) {
    const observable = this.post<ResponseModel>({ 
      controller: this._controller, 
      action: "RecieveBill", 
      queryString: `aggrementId=${aggrementId}&amount=${amount}` 
    }, null) as Observable<ResponseModel>
    return observable
  }
}