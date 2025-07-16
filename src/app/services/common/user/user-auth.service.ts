import { Injectable } from '@angular/core';
import { LoginModel } from '../../../models/loginModel';
import { ResponseModel } from '../../../models/responseModel';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../../../models/singleResponseModel';
import { UserTokenModel } from '../../../models/user/userTokenModel';
import { UserDto } from '../../../models/user/userDto';
import BizimNetHttpClientService from '../../bizimNetHttpClient/bizim-net-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService extends BizimNetHttpClientService{
  private _controller = "Auth"
  login(login: LoginModel) {
    const observable = this.post<any>({ controller: this._controller, action: "Login" }, login) as Observable<SingleResponseModel<UserTokenModel>>
    return observable
  }
  register(register: UserDto) {
    const observable = this.post<any>({ controller: this._controller, action: "Register" }, register) as Observable<ResponseModel>
    return observable
  }
  forgotPassword(mail: string) {
    return this.get<ResponseModel>({ controller: this._controller, action: "ForgotPassword", queryString: `email=${mail}` })
  }
  checkKey(mail: string, key: string) {
    return this.get<ResponseModel>({ controller: this._controller, action: "CheckKey", queryString: `email=${mail}&key=${key}` })
  }

  isAuthenticated() {
    if (localStorage.getItem("token")) {
      return true;
    }
    else {
      return false;
    }
  }
  decodeToken() {
    var token = localStorage.getItem("token");
    if (token) {
      const a = this.jwtHelperService.decodeToken(token);
      return a;
    }
  }
  hasRole(expectedRoles: any[]) {
    const tokenInformation = this.decodeToken();
    const roles = tokenInformation["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as any[]
    let roleResult: number = -1;
    if (Array.isArray(roles)) {
      roleResult = roles.findIndex(role => expectedRoles.indexOf(role) !== -1)
    } else {
      roleResult = expectedRoles.indexOf(roles);
    }
    return (roleResult >= 0) ? true : false
  }
}
