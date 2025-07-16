import { Injectable } from '@angular/core';
import { User } from '../../../models/user/user';
import { ResponseModel } from '../../../models/responseModel';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../../models/listResponseModel';
import { SingleResponseModel } from '../../../models/singleResponseModel';
import { UserDetailsDto } from '../../../models/user/userDetailsDto';
import { ChangePassword } from '../../../models/changePassword';
import BizimNetHttpClientService from '../../bizimNetHttpClient/bizim-net-http-client.service';
import { LoginModel } from '../../../models/loginModel';
import { UserTokenModel } from '../../../models/user/userTokenModel';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BizimNetHttpClientService {

  private _controller = "BusinessUser"

  updateUser(user: User) {
    const observable = this.post<ResponseModel | User>({ controller: this._controller, action: "Update" }, user) as Observable<ResponseModel>
    return observable
  }
  changePassword(changePassword: ChangePassword) {
    const observable = this.post<ResponseModel | ChangePassword>({ controller: this._controller, action: "ChangePassword" }, changePassword) as Observable<ResponseModel>
    return observable
  }
  deleteUser(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<UserDetailsDto>>({ controller: this._controller, action: "GetAll" })
  }
  getById(id: string) {
    return this.get<SingleResponseModel<User>>({ controller: this._controller, action: "GetByUser", queryString: `id=${id}` })
  }
  getImagesByUserId(id: string) {
    return this.get<SingleResponseModel<UserDetailsDto>>({ controller: this._controller, action: "GetImagesByUserId", queryString: `userId=${id}` })
  }

  getUserRoles(code: string, employeeId: string) {
    return this.get<ResponseModel>({ controller: "EmployeeAuthorizationRole", action: "PageRole", queryString: `code=${code}&employeeId=${employeeId}` })
  }
  login(login: LoginModel) {
    const observable = this.post<any>({ controller: this._controller, action: "Login" }, login) as Observable<SingleResponseModel<UserTokenModel>>
    return observable
  }
}
