import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Device } from '../../models/devices/device';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends BizimNetHttpClientService {

  private _controller = "Device";
  
    addDevice(Device: Device) {
      const observable = this.post<ResponseModel | Device>({ controller: this._controller, action: "Add" }, Device) as Observable<ResponseModel>
      return observable
    }
  
    updateDevice(Device: Device) {
      const observable = this.post<ResponseModel | Device>({ controller: this._controller, action: "Update" }, Device) as Observable<ResponseModel>
      return observable
    }
    async deleteDevice(id: string) {
      const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete" ,queryString: `id=${id}` })
      return observable
    }
    getAll() {
      return this.get<ListResponseModel<Device>>({ controller: this._controller, action: "GetAllDetails" })
    }
    getById(id: string) {
      return this.get<SingleResponseModel<Device>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
    }
    getAllByCustomerId(id: string) {
      return this.get<ListResponseModel<Device>>({ controller: this._controller, action: "GetAllByCustomerId", queryString: `id=${id}` })
    }
}
