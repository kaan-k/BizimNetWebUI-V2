import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../common/department.service';
import { firstValueFrom } from 'rxjs';
import { Department } from '../../models/departments/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentComponentService {

  constructor(private departmentService: DepartmentService,private toastrService:ToastrService) { }

  async getAllDepartment() {
      const observable = this.departmentService.getAll()
      const response = await firstValueFrom(observable)
      return response.data
    }
    async getById(id: string) {
      const observable = this.departmentService.getById(id)
      return (await firstValueFrom(observable)).data
    }
    async deleteDepartment(id: string, callBackfunction?: () => void) {
      const observable = await this.departmentService.deleteDepartment(id)
      const promiseData = firstValueFrom(observable)
      promiseData.then(response => {
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
      }).catch(error => {
        this.toastrService.error(error.error)
      })
    }
    async addDepartment(department: Department, callBackfunction?: () => void) {
      const observable = await this.departmentService.addDepartment(department)
      const promiseData = firstValueFrom(observable)
      promiseData.then(response => {
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
      }).catch(error => {
        this.toastrService.error(error.error)
      })
    }
    async updateDepartment(Department: Department, callBackfunction?: () => void) {
      const observable = await this.departmentService.updateDepartment(Department)
      const promiseData = firstValueFrom(observable)
      promiseData.then(response => {
        this.toastrService.success(response.message)
        callBackfunction && callBackfunction()
      }).catch(error => {
        this.toastrService.error(error.error)
      })
    }
}
