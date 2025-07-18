import { Injectable } from '@angular/core';
import { EmployeeService } from '../common/employee.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../../models/employees/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeComponentService {

  constructor(private employeeService: EmployeeService, private toastrService: ToastrService) { }

  async getAllEmployee() {
    const observable = this.employeeService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getById(id: string) {
    const observable = this.employeeService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteEmployee(id: string, callBackfunction?: () => void) {
    const observable = await this.employeeService.deleteEmployee(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addEmployee(Employee: Employee, callBackfunction?: () => void) {
    const observable = await this.employeeService.addEmployee(Employee)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateEmployee(Employee: Employee, callBackfunction?: () => void) {
    const observable = await this.employeeService.updateEmployee(Employee)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}
