import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserImage } from '../../../models/user/userImage';
import { UserImageDto } from '../../../models/user/userImageDto';
import { UserImageService } from '../../common/user/user-image.service';

@Injectable({
  providedIn: 'root'
})
export class UserImageComponentService {
  constructor(private userImageService:UserImageService,private toastrService:ToastrService) { }
  async addImage(image:any,callBackfunction?:()=>void){
    const formData = new FormData();
    formData.append("image",image.imagePath)
    formData.append("userId",image.userId)
    const observable = this.userImageService.addImage(formData)  
    const promiseData= firstValueFrom(observable)
    promiseData.then(response=>{
      this.toastrService.success(response.message)
      window.location.reload()
      callBackfunction&&callBackfunction()
    })
    return await promiseData
  }
  async updateImage(image:any,callBackfunction?:()=>void){
    const formData = new FormData();
    formData.append("id",image.id)
    formData.append("image",image.imagePath)
    formData.append("userId",image.userId)
    const observable =await this.userImageService.updateImage(formData)  
    const promiseData= firstValueFrom(observable)
    promiseData.then(response=>{
      this.toastrService.success(response.message)
      window.location.reload()
      callBackfunction&&callBackfunction()
    })
  }
  async getByImagesByUserId(id:string){
    const observable =this.userImageService.getByImagesByUserId(id)
    return (await firstValueFrom(observable)).data
  }
  async getImagesByUserId(id:string){
    const observable =this.userImageService.getImagesByUserId(id)
    return (await firstValueFrom(observable)).data
  }
}
