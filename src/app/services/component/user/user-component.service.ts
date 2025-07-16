import { Injectable } from '@angular/core';
import { UserService } from '../../common/user/user.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user/user';
import { ChangePassword } from '../../../models/changePassword';
import { LoginModel } from '../../../models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class UserComponentService {
  constructor(private userService:UserService,private toastrService:ToastrService) { }

  async getAllUser() {
    const observable = this.userService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getImagesByUserId(id: string) {
    const observable = this.userService.getImagesByUserId(id)
    return (await firstValueFrom(observable)).data
  }
  async getById(id: string) {
    const observable = this.userService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteUser(id: string, callBackfunction?: () => void) {
    const observable = await this.userService.deleteUser(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateUser(user: User, callBackfunction?: () => void,callBackError ?:(err)=>void) {
    const observable = await this.userService.updateUser(user)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.getImagesByUserId(user.id)
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      callBackError&&callBackError(error)
    })
  }
  async changePassword(changePassword: ChangePassword, callBackfunction?: () => void,callBackError ?:(err)=>void) {
    const observable = await this.userService.changePassword(changePassword)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      localStorage.removeItem("expiration")
      this.toastrService.success(response.message)
      window.location.reload()
      callBackfunction && callBackfunction()
    }).catch(error => {
      callBackError&&callBackError(error)
    })
  }

  async getUserRoles(code: string, employeeId: string) {
    const observable = this.userService.getUserRoles(code, employeeId)
    return (await firstValueFrom(observable))
  }
  async login(user: LoginModel, callBackfunction?: () => void) {
      const observable = await this.userService.login(user)
      const promiseData = firstValueFrom(observable)
      promiseData.then(response => {
        this.toastrService.success(response.message)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId)
        localStorage.setItem("expiration", response.data.expiration)
        callBackfunction && callBackfunction()
      })
    } 
}
