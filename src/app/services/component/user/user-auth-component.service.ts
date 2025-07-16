import { Injectable } from '@angular/core';
import { UserDto } from '../../../models/user/userDto';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { LoginModel } from '../../../models/loginModel'; 
import { UserAuthService } from '../../common/user/user-auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthComponentService {

  constructor(private userAuthService: UserAuthService, private toastrService: ToastrService, private router: Router) { }

  async register(user: UserDto, callBackfunction?: () => void) {
    const observable = await this.userAuthService.register(user)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    })
  }
  isAuthenticated(){
    const observable=this.userAuthService.isAuthenticated()
    return observable
  }
  hasRole(expectedRoles: any[]){
    const observable=this.userAuthService.hasRole(expectedRoles)
    return observable
  }
  async login(user: LoginModel, callBackfunction?: () => void) {
    const observable = await this.userAuthService.login(user)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId)
      localStorage.setItem("expiration", response.data.expiration)
      callBackfunction && callBackfunction()
    })
  } 
  async checkKey(mail: string, key: string, callBackfunction?: () => void) {
    const observable = await this.userAuthService.checkKey(mail, key)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      localStorage.setItem("key", key);
      this.toastrService.success(response.message)
      this.router.navigate(["/password-recovery"])
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async forgotPassword(mail: string, callBackfunction?: () => void) {
    const observable = (await this.userAuthService.forgotPassword(mail))
    localStorage.setItem("mail", mail);
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      this.router.navigate(["/verification-code"])
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

}
