import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Department } from '../../../models/departments/department';
import { Offer } from '../../../models/offers/offer';
import { DepartmentComponentService } from '../../../services/component/department-component.service';
import { DocumentFileComponentService } from '../../../services/component/document-file-component.service';
import { OfferComponentService } from '../../../services/component/offer-component.service';

@Component({
  selector: 'app-update-document-file',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './update-document-file.component.html',
  styleUrl: './update-document-file.component.css'
})
export class UpdateDocumentFileComponent {
 lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"));
  documentFileForm:FormGroup
  @Output() documentEvent = new EventEmitter<any>();
  departments:Department[]
  offers:Offer[]
  @Input() set documentFile(value: any) {
    if (value == null) {
      return;
    }
    this.getallDepartments();
    this.getallOffers();
    this.createDocumentFileForm(value);
  }

  constructor(private documentFileComponentService:DocumentFileComponentService,private offerComponentService:OfferComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder,private departmentComponentService:DepartmentComponentService){}
 
  createDocumentFileForm( value:any) {
    this.documentFileForm = this.formBuilder.group({
      id: [value.id],
      documentName: [value.documentName],
      documentPath: [value.documentPath],
      // departmentId: [value.departmentId],
      // offerId: [value.offerId], 
    });
  }
  async getallDepartments() {
    this.departments = await this.departmentComponentService.getAllDepartment();
  }
  async getallOffers() {
    this.offers = await this.offerComponentService.getAllOffer();
  }

  onSubmit() {  
    const model = Object.assign({}, this.documentFileForm.value) 
    if(model.documentName.trim() =='' || this.selectedFile == null) {
      this.toastrService.error(this.lang.pleaseFillİnformation)
      return
    }
    model.file = this.selectedFile;
    this.documentFileComponentService.updateDocumentFile(model, () => {
      this.documentEvent.emit(true) 
      this.selectedFile = null; 
    })

  }
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
