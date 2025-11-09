import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { ResponseModel } from '../../models/responseModel';
import { Observable } from 'rxjs';
import { Duty } from '../../models/duties/duty'; 
import { ListResponseModel } from '../../models/listResponseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
  
})
export class DutyService extends BizimNetHttpClientService {

  private userId = localStorage.getItem('userId');

  private _controller = "Duty";
  
    addDuty(Duty: Duty){
        const observable = this.post<ResponseModel | Duty>({controller:this._controller, action: "Add"}, Duty) as Observable<ResponseModel>
        return observable
    }
     addDutyCompleted(Duty: Duty){
        const observable = this.post<ResponseModel | Duty>({controller:this._controller, action: "AddCompleted"}, Duty) as Observable<ResponseModel>
        return observable
    }
    
    updateDuty(Duty: Duty){
        const observable = this.post<ResponseModel | Duty>({controller:this._controller, action: "Update"}, Duty) as Observable<ResponseModel>
        return observable
    }
    async deleteDuty(id: string){
        const observable = this.get<ResponseModel>({controller:this._controller, action: "Delete", queryString: `id=${id}` } )
        return observable
    }
    
   getAll(userId: string) {
  return this.get<ListResponseModel<Duty>>({
    controller: this._controller,
    action: "GetAllDetails",
    queryString: `userId=${encodeURIComponent(userId)}`
  });
}
    markAsCompleted(id: string) {
  return this.get<SingleResponseModel<Duty>>({
    controller: this._controller,
    action: "MarkAsCompleted",
    queryString: `id=${id}`,
  });
}
    getById(id: string) {
      return this.get<SingleResponseModel<Duty>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
    }
    getAllById(id: string) {
    const actionWithId = `GetAllByCustomer/${id}`;

    return this.get<SingleResponseModel<Duty>>({ 
        controller: this._controller, 
        action: actionWithId 
    });
}
}
