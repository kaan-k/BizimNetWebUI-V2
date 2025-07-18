import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { DocumentFile } from '../../models/documentFiles/documentFile';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { SingleResponseModel } from '../../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class DocumentFileService extends BizimNetHttpClientService {
  private _controller = "DocumentFileUpload";

  addDocumentFile(DocumentFile: DocumentFile) {
    const observable = this.post<ResponseModel | DocumentFile>({ controller: this._controller, action: "Add" }, DocumentFile) as Observable<ResponseModel>
    return observable
  }

  updateDocumentFile(DocumentFile: DocumentFile) {
    const observable = this.post<ResponseModel | DocumentFile>({ controller: this._controller, action: "Update" }, DocumentFile) as Observable<ResponseModel>
    return observable
  }
  async deleteDocumentFile(id: string) {
    const observable = this.get<ResponseModel>({ controller: this._controller, action: "Delete", queryString: `id=${id}` })
    return observable
  }
  getAll() {
    return this.get<ListResponseModel<DocumentFile>>({ controller: this._controller, action: "GetAll" })
  }
  getById(id: string) {
    return this.get<SingleResponseModel<DocumentFile>>({ controller: this._controller, action: "GetById", queryString: `id=${id}` })
  }
  downloadDocument(id: string): Observable<Blob> {
    const observable=this.get<Blob>({controller:this._controller,action:"DownloadDocument/"+`${id}`,responseType:'blob'})
    return observable
  }
}
