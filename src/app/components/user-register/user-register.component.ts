import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { UserAuthComponentService } from '../../services/component/user/user-auth-component.service';
import { LanguageComponentService } from '../../services/component/language-component.service';
import { Route, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { UserService } from '../../services/common/user/user.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {
  @Output() userEvent = new EventEmitter<any>()
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  isLoginPage = true;
  
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(private userService: UserService,private userAuthComponentService: UserComponentService, private formBuilder: FormBuilder,private languageComponentService:LanguageComponentService,private router:Router,private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.isLoginPage = true;
    this.createRegisterForm();
    this.startLanguage();
  }
  startLanguage(){
    var languControl= localStorage.getItem("lng")
     if(languControl==null){
       this.changeLanguage("tr");
     }
   }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  createRegisterForm() {
  this.registerForm = this.formBuilder.group({
    firstName: [""],
    lastName: [""],
    email: [""],
    password: ["", Validators.required],
    confirmPassword: [""],
    title: [""],
    phoneNumber: [""],
  });
}


 register() {
  if (this.registerForm.valid) {
    const model = { ...this.registerForm.value };
    model.phoneNumber = model.phoneNumber.toString();

    // if (!model.email.trim() || !model.firstName.trim() || !model.lastName.trim() || !model.title.trim()) {
    //   this.toastrService.error(this.lang.pleaseFillİnformation);
    //   return;
    // }

    this.userService.Add(model, () => {}).subscribe({
      next: () => {
        this.userEvent.emit(true);
        this.createRegisterForm();
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

  login() {
    if (this.loginForm.valid) {
      let model = Object.assign({}, this.loginForm.value);
      this.userAuthComponentService.login(model,()=>{
        this.router.navigate(["/"])
      })
    }
  }
  changeLanguage(language:string){
    localStorage.setItem("lng",language)
    this.languageComponentService.setLanguage(language)
    window.location.reload()
  }
}
