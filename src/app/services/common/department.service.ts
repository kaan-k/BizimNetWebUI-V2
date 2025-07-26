import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Department } from '../../models/departments/department';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BizimNetHttpClientService {

  private _controller = "Department";
  
    addDepartment(Department: Department) {
      const observable = this.post<ResponseModel | Department>({ controller: this._controller, action: "Add" }, Department) as Observable<ResponseModel>
      return observable
    }
  
    updateDepartment(Department: Department) {
      const observable = this.post<ResponseModel | Department>({ controller: this._controller, action: "Update" }, Department) as Observable<ResponseModel>
      return observable
    }
    async deleteDepartment(id: string) {
      const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
      return observable
    }
    getAll() {
      return this.get<ListResponseModel<Department>>({ controller: this._controller, action: "GetAll" })
    }
    getById(id: string) {
      return this.get<SingleResponseModel<Department>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
    }
}
