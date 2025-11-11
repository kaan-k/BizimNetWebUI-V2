import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom, observable } from 'rxjs';
import { Duty } from '../../models/duties/duty';
import { DutyService } from '../common/duty.service';
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DutyComponentService {

  constructor(private dutyService: DutyService, private toastrService: ToastrService) { }

  async getById(id:string){
    const observable = this.dutyService.getById(id)
    return (await firstValueFrom(observable)).data
  }
   async getAllById(id:string){
    const observable = this.dutyService.getAllById(id)
    return (await firstValueFrom(observable)).data
  }

  async getAllByStatus(status:string){
    const observable = this.dutyService.getAllByStatus(status)
    return (await firstValueFrom(observable)).data
  }
   async getAllByEmployeeId(employeeId:string){
    const observable = this.dutyService.getAllByEmployeeId(employeeId)
    return (await firstValueFrom(observable)).data
  }

  async getAllDuty(){
    const observable = this.dutyService.getAll(localStorage.getItem('userId'))
    const response = await firstValueFrom(observable)
    return response.data
  }
  async markAsCompleted(id: string) {
    const observable = this.dutyService.markAsCompleted(id)
    return (await firstValueFrom(observable))
  }
  async deleteDuty(id:string, callBackfunction?: () => void){
    const observable = await this.dutyService.deleteDuty(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response =>{
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
    }).catch(error =>{
        this.toastrService.error(error.error)
    })
  }
  async addDuty(Duty: Duty, callBackfunction?: () => void){
    const observable = await this.dutyService.addDuty(Duty)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response=>{
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
    }).catch(error=>{
        this.toastrService.error(error.error)
    })
  }
  async addDutyCompleted(Duty: Duty, callBackfunction?: () => void){
    const observable = await this.dutyService.addDutyCompleted(Duty)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response=>{
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
    }).catch(error=>{
        this.toastrService.error(error.error)
    })
  }
  async updateDuty(Duty:Duty, callBackfunction?: () => void){
    const observable = await this.dutyService.updateDuty(Duty)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response=>{
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
    }).catch(error=>{
        this.toastrService.error(error.error)
    })
  }


}
