import { Injectable } from '@angular/core';
import { DocumentFileService } from '../common/document-file.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DocumentFile } from '../../models/documentFiles/documentFile';

@Injectable({
  providedIn: 'root'
})
export class DocumentFileComponentService {

  constructor(private documentFileService: DocumentFileService, private toastrService: ToastrService) { }

  async getAllDocumentFile() {
    const observable = this.documentFileService.getAll()
    const response = await firstValueFrom(observable)
    return response.data
  }
  async getById(id: string) {
    const observable = this.documentFileService.getById(id)
    return (await firstValueFrom(observable)).data
  }
  async deleteDocumentFile(id: string, callBackfunction?: () => void) {
    const observable = await this.documentFileService.deleteDocumentFile(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async addDocumentFile(DocumentFile: DocumentFile, callBackfunction?: () => void) {
    const observable = await this.documentFileService.addDocumentFile(DocumentFile)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async updateDocumentFile(DocumentFile: DocumentFile, callBackfunction?: () => void) {
    const observable = await this.documentFileService.updateDocumentFile(DocumentFile)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
  async downloadDocument(documentId: string,documentName:string) {
    const blob = await firstValueFrom(this.documentFileService.downloadDocument(documentId));
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = `${documentName}.pdf`;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
