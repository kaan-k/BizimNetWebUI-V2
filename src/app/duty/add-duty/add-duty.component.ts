import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../assets/locales/ILanguage'; 
import { Languages } from '../../../assets/locales/language';
import { DutyComponentService } from '../../services/component/duty-component.service';
import { ToastrService } from 'ngx-toastr';
import { Duty } from '../../models/duties/duty'; 

@Component({
  selector: 'app-add-duty',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-duty.component.html',
  styleUrl: './add-duty.component.css'
})
export class AddDutyComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng")); 
  dutyForm:FormGroup
  @Output() dutyEvent = new EventEmitter<any>();
  constructor(private dutyComponentService:DutyComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder) {}

  ngOnInit() {
    this.createDutyForm();
  }
  createDutyForm() {
    this.dutyForm = this.formBuilder.group({
      customerId: [''],
      details: [''],
      status: [''], 
    });
  }

  addDuty(){
    if(this.dutyForm.valid){
      const model = Object.assign({}, this.dutyForm.value)
      console.log(model);
      if(model.details.trim() == ''){
        this.toastrService.error(this.lang.pleaseFillİnformation)
        return
      }
      this.dutyComponentService.addDuty(model,()=>{
        this.dutyEvent.emit(true)
        this.createDutyForm()
      })
    }else{
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }

  
}
