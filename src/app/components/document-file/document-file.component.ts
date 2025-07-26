import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { DocumentFileComponentService } from '../../services/component/document-file-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CellClickedEvent, ColDef, ColGroupDef, GridOptions, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { DocumentFile } from '../../models/documentFiles/documentFile';
import { AgGridModule } from 'ag-grid-angular';
import { NavbarDocumentFileComponent } from './navbar-document-file/navbar-document-file.component';
import { AddDocumentFileComponent } from './add-document-file/add-document-file.component';
import { UpdateDocumentFileComponent } from './update-document-file/update-document-file.component';

@Component({
  selector: 'app-document-file',
  standalone: true,
  imports: [CommonModule,AgGridModule,NavbarDocumentFileComponent,AddDocumentFileComponent,UpdateDocumentFileComponent],
  templateUrl: './document-file.component.html',
  styleUrl: './document-file.component.css'
})
export class DocumentFileComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"))
  documentFileDelete: boolean = false;
  documentFile:DocumentFile;

  constructor(private documentFileComponentService: DocumentFileComponentService, private dialog: MatDialog) { }
protected gridOptions: GridOptions = {
      pagination: true,
      paginationPageSize: 50,
    };
  
    public columnDefs: (ColDef | ColGroupDef)[] = [
      { field: 'offerId', headerName: this.lang.offerName, unSortIcon: true, },
      { field: 'departmentId', headerName: this.lang.departmentName, unSortIcon: true },
      { field: 'documentName', headerName: this.lang.documentName, unSortIcon: true }, 
      { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: true },
      { field: 'lastModifiedAt', headerName: this.lang.lastModifiedAt, unSortIcon: true },
      {
        field: 'Download', headerName: this.lang.download, filter: false, valueGetter: (params) => {
          return 'Download';
        },
        cellRenderer: () => {
          return `<i class="fa-solid fa-file-arrow-down"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
        },
        onCellClicked: (event: CellClickedEvent) =>
          this.downloadDocument(event.data.id,event.data.documentName)
      },
      {
        field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
          return 'Delete';
        },
        cellRenderer: () => {
          return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
        },
        onCellClicked: (event: CellClickedEvent) =>
          this.deleteDocumentFile(event.data.id),
      },
      {
        field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
          return 'Update';
        },
        cellRenderer: () => {
          return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#documentFileUpdateModal"></i>`;
        },
        onCellClicked: (event: CellClickedEvent) => {
          this.getById(event.data.id)
        }
      },
    ];
    public rowSelection = 'multiple';
    public defaultColDef: ColDef = {
      flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
      floatingFilter: true,
      minWidth: 130,
    };
    public rowBuffer = 0;
    public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' =
      'infinite';
    public cacheBlockSize = 300;
    public cacheOverflowSize = 2;
    public maxConcurrentDatasourceRequests = 1;
    public infiniteInitialRowCount = 1000;
    public maxBlocksInCache = 10;
    public noRowsTemplate: any
    public rowData!: any[];
    public sideBar: SideBarDef | string | string[] | boolean | null = {
      toolPanels: ['columns', 'filters'],
      defaultToolPanel: '',
    };
  
    onGridReady(params: GridReadyEvent) {
      params.api.sizeColumnsToFit();
      this.getAllDocumentFile()
    }
    async getAllDocumentFile() {
      this.rowData=await this.documentFileComponentService.getAllDocumentFile()
    }
    async getById(id: string) {
      this.documentFile = await this.documentFileComponentService.getById(id);
    }
    async downloadDocument(documentId: string, documentName: string) {
    this.documentFileComponentService.downloadDocument(documentId,documentName);
  }

  deleteDocumentFile(id: string) {
      this.openDialog().afterClosed().subscribe(async result => {
        if (!result) {
          return
        }
        this.documentFileComponentService.deleteDocumentFile(id, () => { this.getAllDocumentFile() })
      })
  }
  openDialog() {
    return this.dialog.open(DocumentFileDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }

}
@Component({
  selector: 'document-file-delete-template',
  template: `
  <h5 mat-dialog-title>
    {{lang.areYouSureYouWanttoDelete}}</h5>
   <div mat-dialog-content>
   </div>
   <div mat-dialog-actions class="mat-mdc-dialog-actions">
    <button class="button-4" mat-button [mat-dialog-close]=false><i class="fa-solid fa-circle-xmark"></i> {{lang.cancel}}</button>
    <button class="button-24" mat-button [mat-dialog-close]=true cdkFocusInitial><i class="fa-solid fa-trash-can"></i> {{lang.delete}}</button>
   </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],

})
export class DocumentFileDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<DocumentFileDeleteTemplate>) {
  }
}
