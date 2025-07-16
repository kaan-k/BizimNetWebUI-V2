import { Injectable } from '@angular/core'; 
import { UserImage } from '../../../models/user/userImage';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../../models/listResponseModel';
import { ResponseModel } from '../../../models/responseModel';
import { UserImageDto } from '../../../models/user/userImageDto';
import { SingleResponseModel } from '../../../models/singleResponseModel';
import BizimNetHttpClientService from '../../bizimNetHttpClient/bizim-net-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserImageService extends BizimNetHttpClientService {

  private _controller = "UserImage"
   addImage(image: any) {
    const observable = this.post<ResponseModel | any>({ controller: this._controller, action: "Add" }, image) as Observable<ResponseModel>
    return observable
  }
  async updateImage(formData: FormData) {
    const observable = this.post<ResponseModel | any>({ controller: this._controller, action: "Update" }, formData) as Observable<ResponseModel>
    return observable
  }
  getByImagesByUserId(id: string) {
    return this.get<ListResponseModel<UserImageDto>>({ controller: this._controller, action: "GetByImagesByUserId", queryString: `id=${id}` })
  }
  getImagesByUserId(id: string) {
    return this.get<SingleResponseModel<UserImageDto>>({ controller: this._controller, action: "GetImagesByUserId", queryString: `id=${id}` })
  }
}
