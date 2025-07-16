import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { UserComponentService } from '../../../services/component/user/user-component.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {

  @Output() userEvent = new EventEmitter<any>()
  @Input() set userDetail(value: any) {
    if (!value) return
    this.updateUserForm(value)
  }
  protected userUpdateForm: FormGroup
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(private userComponentService: UserComponentService, private formBuilder: FormBuilder, private toastrService: ToastrService) { }

  updateUserForm(value: any) {
    this.userUpdateForm = this.formBuilder.group({
      id: [value.id],
      firstName: [value.firstName,Validators.required],
      lastName: [value.lastName,Validators.required],
      email: [value.email,Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      title: [value.title,Validators.required],
      phoneNumber: [value.phoneNumber,Validators.pattern(/^[0-9]{10}$/)],
      status: [value.status],
    })
  }

  updateUser() {
    if (this.userUpdateForm.valid) {
      const model = Object.assign({}, this.userUpdateForm.value)
      model.phoneNumber = model.phoneNumber.toString()
      if (model.email.trim() == '' || model.firstName.trim() == '' || model.lastName.trim() == '' || model.title.trim() == '') {
        this.toastrService.error(this.lang.pleaseFillİnformation)
        return
      }
      this.userComponentService.updateUser(model, () => {
        this.userEvent.emit(true)
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }
}
