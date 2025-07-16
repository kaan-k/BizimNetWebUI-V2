import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { UserAuthComponentService } from '../../services/component/user/user-auth-component.service';
import { LanguageComponentService } from '../../services/component/language-component.service';
import { Route, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserComponentService } from '../../services/component/user/user-component.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  loginForm: FormGroup;
  isLoginPage = true;
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(private userAuthComponentService: UserComponentService, private formBuilder: FormBuilder,private languageComponentService:LanguageComponentService,private router:Router,private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.isLoginPage = true;
    this.createLoginForm();
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
