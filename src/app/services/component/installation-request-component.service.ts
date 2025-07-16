import { Injectable } from '@angular/core'; 
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { InstallationRequestService } from '../common/installation-request.service';
import { InstallationRequest } from '../../models/installationRequest/installationRequest';

@Injectable({
  providedIn: 'root'
})
export class InstallationRequestComponentService {

  constructor(private installationRequestService:InstallationRequestService,private toastrService:ToastrService) { }

  async getAllInstallationRequest() {
        const observable = this.installationRequestService.getAll()
        const response = await firstValueFrom(observable)
        return response.data
      } 
      async getById(id: string) {
        const observable = this.installationRequestService.getById(id)
        return (await firstValueFrom(observable)).data
      }
      async deleteInstallationRequest(id: string, callBackfunction?: () => void) {
        const observable = await this.installationRequestService.deleteInstallationRequest(id)
        const promiseData = firstValueFrom(observable)
        promiseData.then(response => {
          this.toastrService.success(response.message)
          callBackfunction && callBackfunction()
        }).catch(error => {
          this.toastrService.error(error.error)
        })
      }
      async addInstallationRequest(InstallationRequest: InstallationRequest, callBackfunction?: () => void) {
        const observable = await this.installationRequestService.addInstallationRequest(InstallationRequest)
        const promiseData = firstValueFrom(observable)
        promiseData.then(response => {
          this.toastrService.success(response.message)
          callBackfunction && callBackfunction()
        }).catch(error => {
          this.toastrService.error(error.error)
        })
      }
      async updateInstallationRequest(InstallationRequest: InstallationRequest, callBackfunction?: () => void) {
        const observable = await this.installationRequestService.updateInstallationRequest(InstallationRequest)
        const promiseData = firstValueFrom(observable)
        promiseData.then(response => {
          this.toastrService.success(response.message)
          callBackfunction && callBackfunction()
        }).catch(error => {
          this.toastrService.error(error.error)
        })
      }
}
