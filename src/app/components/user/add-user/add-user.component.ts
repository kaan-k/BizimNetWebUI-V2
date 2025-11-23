import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { UserAuthComponentService } from '../../../services/component/user/user-auth-component.service';
import { UserService } from '../../../services/common/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Necessary for Dialog

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule], // Added MatDialogModule
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() userEvent = new EventEmitter<any>()
  protected userAddForm: FormGroup;
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  
  // Flag to manage loading state (good practice for UX)
  isLoading: boolean = false; 

  constructor(
    private userAuthComponentService: UserAuthComponentService,
    private userService: UserService,
    private formBuilder: FormBuilder, 
    private toastrService: ToastrService,
    // Inject MatDialogRef to handle closing the dialog
    public dialogRef: MatDialogRef<AddUserComponent> 
  ) {
    this.createNewUserForm();
  }

  createNewUserForm() {
    this.userAddForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Added min length
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      title: ['', Validators.required],
      status: [false], 
      phoneNumber: ['', [Validators.pattern(/^\+?\d{10,15}$/)]] // Updated regex for international format/length
    });
  }

  addUser() {
    if (this.userAddForm.invalid) {
        this.toastrService.warning(this.lang.pleaseFillİnformation, 'Eksik Bilgi');
        this.userAddForm.markAllAsTouched();
        return;
    }
    
    this.isLoading = true;
    const model = { ...this.userAddForm.value };
    // Ensure phone number is treated as a string, though API usually handles this
    model.phoneNumber = model.phoneNumber ? model.phoneNumber.toString() : ''; 

    this.userService.Add(model, () => {}).subscribe({
      next: () => {
        this.toastrService.success('Kullanıcı başarıyla eklendi', 'Başarılı');
        this.userEvent.emit(true); // Notify parent component to refresh grid
        this.createNewUserForm(); // Reset form fields
        this.isLoading = false;
        this.dialogRef.close(true); // Close the dialog on success

      },
      error: (err) => {
        this.toastrService.error('Kullanıcı eklenirken hata oluştu', 'Hata');
        this.isLoading = false;
        console.error("API Error:", err);
      }
    });
  }
  
  close() {
    this.dialogRef.close(false);
  }
}