import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { InstallationRequest } from '../../models/installationRequest/installationRequest';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class InstallationRequestService extends BizimNetHttpClientService {

  private _controller = "InstallationRequest";
  
    addInstallationRequest(InstallationRequest: InstallationRequest) {
      const observable = this.post<ResponseModel | InstallationRequest>({ controller: this._controller, action: "Add" }, InstallationRequest) as Observable<ResponseModel>
      return observable
    }
  
    updateInstallationRequest(InstallationRequest: InstallationRequest) {
      const observable = this.post<ResponseModel | InstallationRequest>({ controller: this._controller, action: "Update" }, InstallationRequest) as Observable<ResponseModel>
      return observable
    }
    async deleteInstallationRequest(id: string) {
      const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
      return observable
    }
    getAll() {
      return this.get<ListResponseModel<InstallationRequest>>({ controller: this._controller, action: "GetAllInstallationRequestDetails" })
    }
    getById(id: string) {
      return this.get<SingleResponseModel<InstallationRequest>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
    }
  } 
