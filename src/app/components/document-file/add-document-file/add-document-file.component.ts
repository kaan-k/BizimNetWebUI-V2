import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { DocumentFileComponentService } from '../../../services/component/document-file-component.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentComponentService } from '../../../services/component/department-component.service';
import { Department } from '../../../models/departments/department';
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { Offer } from '../../../models/offers/offer';

@Component({
  selector: 'app-add-document-file',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-document-file.component.html',
  styleUrl: './add-document-file.component.css'
})
export class AddDocumentFileComponent {
  lang:ILanguage=Languages.lngs.get(localStorage.getItem("lng"));
  documentFileForm:FormGroup
  @Output() documentEvent = new EventEmitter<any>();
  departments:Department[]
  offers:Offer[]

  constructor(private documentFileComponentService:DocumentFileComponentService,private offerComponentService:OfferComponentService,private toastrService:ToastrService,private formBuilder:FormBuilder,private departmentComponentService:DepartmentComponentService){}

  ngOnInit() {
    this.getallDepartments();
    this.getallOffers();
    this.createDocumentFileForm();
  }
  createDocumentFileForm() {
    this.documentFileForm = this.formBuilder.group({
      documentName: [''],
      departmentId: [''],
      offerId: [''], 
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
    this.documentFileComponentService.addDocumentFile(model, () => {
      this.documentEvent.emit(true) 
      this.selectedFile = null; 
    })

  }
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
