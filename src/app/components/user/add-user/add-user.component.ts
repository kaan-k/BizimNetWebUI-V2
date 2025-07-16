import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { UserAuthComponentService } from '../../../services/component/user/user-auth-component.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() userEvent = new EventEmitter<any>()
  protected userAddForm: FormGroup
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(
    private userAuthComponentService: UserAuthComponentService,
    private formBuilder: FormBuilder, private toastrService: ToastrService) {
    this.createNewUserForm()
  }

  createNewUserForm() {
    this.userAddForm = this.formBuilder.group({
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      status: [false, Validators.required],
      phoneNumber: ['', Validators.pattern(/^[0-9]{10}$/)],
    })
  }

  addUser() {
    if (this.userAddForm.valid) {
      const model = Object.assign({}, this.userAddForm.value)
      model.phoneNumber = model.phoneNumber.toString()
      if (model.email.trim() == '' || model.firstName.trim() == '' || model.lastName.trim() == '' || model.title.trim() == '') {
        this.toastrService.error(this.lang.pleaseFillİnformation)
        return
      }
      this.userAuthComponentService.register(model, () => {
        this.userEvent.emit(true)
        this.createNewUserForm()
      })
    } else {
      this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error)
    }
  }

}
