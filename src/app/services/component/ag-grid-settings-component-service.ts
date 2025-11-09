import { Injectable } from '@angular/core';
import { CustomerService } from '../common/customer.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Customer } from '../../models/customers/cusotmers';
import { CustomerDto } from '../../models/customers/customerDto';
import { AgGridSettings } from '../common/ag-grid-settings.service';
import { agGridPersistSettingsDto } from '../../models/agGrid/agGridPersistSettingsDto';

@Injectable({
  providedIn: 'root'
})
export class AgGridSettingsComponentService {

  constructor(private agGridSettingsService: AgGridSettings, private toastrService: ToastrService) { }
 
  

    // async addSetting(AgGridSettings: agGridPersistSettingsDto, callBackfunction?: () => void) {
    //     const observable = await this.agGridSettingsService.addSetting(AgGridSettings)
    //     const promiseData = firstValueFrom(observable)
    //     promiseData.then(response => {
    //       this.toastrService.success(response.message)
    //       localStorage.setItem("token", response.data);
    //       localStorage.setItem("userId", response)
    //       localStorage.setItem("expiration", response.data.expiration)
    //       callBackfunction && callBackfunction()
    //     })
    //   } 
 
}
