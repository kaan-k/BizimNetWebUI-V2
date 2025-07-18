import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Employee } from '../../models/employees/employee';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BizimNetHttpClientService {

  private _controller = "Employee";

  addEmployee(Employee: Employee) {
    const observable = this.post<ResponseModel | Employee>({ controller: this._controller, action: "Add" }, Employee) as Observable<ResponseModel>
    return observable
  }

  updateEmployee(Employee: Employee) {
    const observable = this.post<ResponseModel | Employee>({ controller: this._controller, action: "Update" }, Employee) as Observable<ResponseModel>
    return observable
  }
  async deleteEmployee(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<Employee>>({ controller: this._controller, action: "GetAll" })
  }
  getById(id: string) {
    return this.get<SingleResponseModel<Employee>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }
}
