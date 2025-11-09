import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage'; 
import { Languages } from '../../../../assets/locales/language'; 
import { Customer } from '../../../models/customers/cusotmers';
import { DutyComponentService } from '../../../services/component/duty-component.service';  
import { CommonModule } from '@angular/common';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { UserComponentService } from '../../../services/component/user/user-component.service';
import { create } from 'domain';

@Component({
  selector: 'app-update-duty',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './update-duty.component.html',
  styleUrl: './update-duty.component.css'
})
export class UpdateDutyComponent {

  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng")); 
    dutyForm:FormGroup
    @Input() set duty(value: any) {
      if(!value)return;
      this.updateDutyForm(value);
    }
    customers:Customer[];
    employees: any[] = [];

    @Output() dutyEvent = new EventEmitter<any>();
    constructor(private userComponentService:UserComponentService,private dutyComponentService:DutyComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder,private customerComponentService:CustomerComponentService) {}
  
    ngOnInit() {
      this.getAllCustomers();
      this.getEmployees();
    }

    updateDutyForm(value:any){
      this.dutyForm = this.formBuilder.group({
        customerId: [value.customerId],
        description: [value.description],
        id: [value.id],
        priority: [value.priority],
        name: [value.name],
        deadline: [value.deadline],
        createdBy: [value.createdBy],
        completedBy: [value.completedBy],
        assignedEmployeeId: [value.assignedEmployeeId],
      });
    }


    updateDuty(){
      if(this.dutyForm.valid){
        const model = Object.assign({}, this.dutyForm.value)
        console.log(model);
        if(model.description.trim() == ''){
          this.toastrService.error(this.lang.pleaseFillİnformation)
          return
        }
        this.dutyComponentService.updateDuty(model,()=>{
          this.dutyEvent.emit(true)
        })
      }else{
        this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
      }
    }
    async getEmployees() {
    return this.employees = await this.userComponentService.getAllUser();
  }
  
    async getAllCustomers(){
      return this.customers= await this.customerComponentService.getAllCustomer();
    }

}
