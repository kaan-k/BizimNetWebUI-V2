import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { UserAuthComponentService } from '../../../services/component/user/user-auth-component.service';
import { UserService } from '../../../services/common/user/user.service';
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
    private userService: UserService,
    private formBuilder: FormBuilder, private toastrService: ToastrService) {
    this.createNewUserForm()
  }

 createNewUserForm() {
  this.userAddForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    title: ['', Validators.required],
    status: [false], // handle via toggle or dropdown
    phoneNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]]
  });
}


  addUser() {
  if (this.userAddForm.valid) {
    const model = { ...this.userAddForm.value };
    model.phoneNumber = model.phoneNumber.toString();

    if (!model.email.trim() || !model.firstName.trim() || !model.lastName.trim() || !model.title.trim()) {
      this.toastrService.error(this.lang.pleaseFillİnformation);
      return;
    }

    this.userService.Add(model, () => {}).subscribe({
      next: () => {
        this.userEvent.emit(true);
        this.createNewUserForm();
        this.toastrService.success('Kullanıcı başarıyla eklendi', 'Başarılı');
      },
      error: () => {
        this.toastrService.error('Kullanıcı eklenirken hata oluştu', 'Hata');
      }
    });

  } else {
    this.toastrService.info(this.lang.pleaseFillİnformation, this.lang.error);
  }
}

}
