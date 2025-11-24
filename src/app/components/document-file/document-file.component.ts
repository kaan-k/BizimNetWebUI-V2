import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { DocumentFileComponentService } from '../../services/component/document-file-component.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CellClickedEvent, ColDef, ColGroupDef, GridOptions, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { DocumentFile } from '../../models/documentFiles/documentFile';
import { AgGridModule } from 'ag-grid-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

// Child Components
import { NavbarDocumentFileComponent } from './navbar-document-file/navbar-document-file.component';
import { AddDocumentFileComponent } from './add-document-file/add-document-file.component';
import { GenerateDailyreportDocumentFileComponent } from './generate-dailyreport-document-file/generate-dailyreport-document-file.component';
import { GenerateServicereportDocumentFileComponent } from './generate-servicereport-document-file/generate-servicereport-document-file.component';
import { UpdateDocumentFileComponent } from './update-document-file/update-document-file.component';
import { AgPersist } from '../../ag-persist';

@Component({
  selector: 'app-document-file',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    NavbarDocumentFileComponent,
    AddDocumentFileComponent,
    UpdateDocumentFileComponent,
    GenerateDailyreportDocumentFileComponent,
    GenerateServicereportDocumentFileComponent,
    MatDialogModule,
    MatMenuModule
  ],
  templateUrl: './document-file.component.html',
  styleUrl: './document-file.component.css'
})
export class DocumentFileComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  documentFileDelete: boolean = false;
  documentFile: DocumentFile;

  private agPersist = new AgPersist('documentFilePersist');

  protected gridOptions: GridOptions = this.agPersist.setup({
    pagination: true,
    paginationPageSize: 50,
  });

  public columnDefs: (ColDef | ColGroupDef)[] = [];

  public defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 100,
  };

  public rowSelection = 'multiple';
  public rowBuffer = 0;
  public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' = 'infinite';
  public cacheBlockSize = 300;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 1;
  public infiniteInitialRowCount = 1000;
  public maxBlocksInCache = 10;
  public noRowsTemplate: any;
  public rowData!: any[];
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['columns', 'filters'],
    defaultToolPanel: '',
  };

  constructor(
    private documentFileComponentService: DocumentFileComponentService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    // Define columns in constructor to bind 'this' context correctly
    this.columnDefs = [
      { field: 'documentName', headerName: this.lang.documentName, unSortIcon: true, flex: 2 },
      { field: 'documentType', headerName: "Belge Tipi", unSortIcon: true, width: 150 },
      {
        field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: true, width: 150,
        valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('tr-TR') : ''
      },
      {
        field: 'lastModifiedAt', headerName: this.lang.lastModifiedAt, unSortIcon: true, width: 150,
        valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('tr-TR') : ''
      },
      {
        field: 'View', headerName: 'Görüntüle', filter: false,
        width: 70, maxWidth: 70, cellStyle: { 'text-align': 'center' },
        valueGetter: () => 'View',
        cellRenderer: (params: any) => {
           return `<i class="fa-solid fa-eye text-primary" style="cursor:pointer; font-size:18px;" title="Önizle"></i>`;
        },
        onCellClicked: (event: CellClickedEvent) => {
            // Explicitly pass the data from the event to ensure we use the clicked row's data
            this.viewDocument(event.data);
        }
      },
      {
        field: 'Download', headerName: this.lang.download, filter: false,
        width: 70, maxWidth: 70, cellStyle: { 'text-align': 'center' },
        valueGetter: () => 'Download',
        cellRenderer: () => `<i class="fa-solid fa-file-arrow-down" style="cursor:pointer; font-size:18px;"></i>`,
        onCellClicked: (event: CellClickedEvent) => this.downloadDocument(event.data.id, event.data.documentName)
      },
      {
        field: 'Update', headerName: this.lang.update, filter: false,
        width: 70, maxWidth: 70, cellStyle: { 'text-align': 'center' },
        valueGetter: () => 'Update',
        cellRenderer: () => `<i class="fa-solid fa-pen" style="cursor:pointer; font-size:18px;" data-bs-toggle="modal" data-bs-target="#documentFileUpdateModal"></i>`,
        onCellClicked: (event: CellClickedEvent) => this.getById(event.data.id)
      },
      {
        field: 'Delete', headerName: this.lang.delete, filter: false,
        width: 70, maxWidth: 70, cellStyle: { 'text-align': 'center' },
        valueGetter: () => 'Delete',
        cellRenderer: () => `<i class="fa-solid fa-trash-can" style="cursor:pointer; font-size:18px;"></i>`,
        onCellClicked: (event: CellClickedEvent) => this.deleteDocumentFile(event.data.id),
      },
    ];
  }

  ngOnInit() { }

  private getEffectiveType(data: any): string {
    let type = (data.documentType || '').toLowerCase();
    if (!type || type === 'file' || type.length < 2) {
        const name = (data.documentName || '').toLowerCase();
        if (name.includes('.')) {
            type = name.split('.').pop() || ''; 
        }
    }
    return type;
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllDocumentFile()
  }

  async getAllDocumentFile() {
    this.rowData = await this.documentFileComponentService.getAllDocumentFile()
  }

  async viewDocument(data: any) {
    // 1. Unique Request ID
    const reqId = data.id;
    console.log(`[VIEW] Requesting document for ID: ${reqId}`); 

    try {
      // 2. Fetch FRESH Blob from Service
      const blob = await this.documentFileComponentService.getFileBlob(reqId);
      
      // 3. Validation
      if (!blob || blob.size === 0) {
        this.toastr.error("Dosya içeriği alınamadı (Boş Dosya).");
        return;
      }

      // 4. Determine Type (Server Headers Priority > Fallback)
      let finalType = blob.type.toLowerCase();
      if (!finalType || finalType.includes('octet-stream') || finalType.includes('application/x-download')) {
        finalType = this.getEffectiveType(data); 
      }

      console.log(`[VIEW] Blob Size: ${blob.size}, Type: ${blob.type}, FinalType: ${finalType}`);

      // 5. Check Support
      const isSupported = finalType.includes('pdf') || 
                          finalType.includes('image') || 
                          finalType.includes('jpg') || 
                          finalType.includes('png') || 
                          finalType.includes('jpeg');

      if (!isSupported) {
        this.toastr.warning(`Bu dosya formatı tarayıcıda önizlenemez: ${finalType}`);
        return;
      }

      // 6. Open Dialog with specific blob data
      this.dialog.open(DocumentViewDialog, {
        width: '80%',
        height: '90%',
        maxWidth: '1200px',
        panelClass: 'matdialog-view-doc',
        data: { 
            blob: blob, // Pass the blob directly
            type: finalType, 
            name: data.documentName 
        }
      });

    } catch (error) {
      console.error(`[VIEW] Error fetching document ${reqId}:`, error);
      this.toastr.error("Dosya indirilirken hata oluştu.");
    }
  }

  async getById(id: string) {
    this.documentFile = await this.documentFileComponentService.getById(id);
  }

  async downloadDocument(documentId: string, documentName: string) {
    this.documentFileComponentService.downloadDocument(documentId, documentName);
  }

  deleteDocumentFile(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) return;
      this.documentFileComponentService.deleteDocumentFile(id, () => { this.getAllDocumentFile() })
    })
  }

  openDialog() {
    return this.dialog.open(DocumentFileDeleteTemplate, {
      width: '450px',
      panelClass: 'matdialog-delete',
    });
  }

  openServiceReportDialog() {
    const ref = this.dialog.open(GenerateServicereportDocumentFileComponent, {
      width: '500px',
      panelClass: 'matdialog-view', 
    });
    ref.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllDocumentFile(); 
      }
    });
  }

  openDailyReportDialog() {
    const ref = this.dialog.open(GenerateDailyreportDocumentFileComponent, {
      panelClass: 'matdialog-view', 
    });
    ref.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllDocumentFile(); 
      }
    });
  }

  resetParameters(): void {
    const dialogRef = this.dialog.open(ResetConfirmDialog, {
        width: '450px',
        panelClass: 'matdialog-confirm',
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            this.agPersist.resetGridSettings();
            window.location.reload();
        }
    });
  }
}

// --- VIEW DIALOG COMPONENT ---
@Component({
  selector: 'document-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-layout h-100">
      <div class="dialog-header d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
        <h5 class="m-0 text-truncate"><i class="fa-solid fa-eye me-2 text-primary"></i> {{ data.name }}</h5>
        <button class="btn-icon" (click)="close()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="dialog-body p-0 bg-light d-flex align-items-center justify-content-center" style="height: calc(100% - 60px); overflow: hidden;">
        <iframe *ngIf="isPdf" [src]="safeUrl" width="100%" height="100%" frameborder="0"></iframe>
        <img *ngIf="isImage" [src]="safeUrl" class="img-fluid" style="max-height: 100%; object-fit: contain;">
        <div *ngIf="!isPdf && !isImage" class="text-center text-muted">
             <i class="fa-solid fa-file-circle-xmark fa-3x mb-3"></i>
             <p>Önizleme yapılamıyor.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-layout { display: flex; flex-direction: column; overflow: hidden; }
    .btn-icon { background: none; border: none; font-size: 1.2rem; color: #64748b; transition: 0.2s; }
    .btn-icon:hover { color: #ef4444; transform: scale(1.1); }
  `]
})
export class DocumentViewDialog {
  safeUrl: SafeResourceUrl | null = null;
  isPdf = false;
  isImage = false;

  constructor(
    public dialogRef: MatDialogRef<DocumentViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { blob: Blob, type: string, name: string },
    private sanitizer: DomSanitizer
  ) {
    if (data.blob) {
      // Create a specific URL for this specific blob instance
      const url = URL.createObjectURL(data.blob);
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      const type = data.type.toLowerCase();
      if (type.includes('pdf')) {
        this.isPdf = true;
      } else if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
        this.isImage = true;
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
// --- DELETE & RESET DIALOGS (Değişiklik yok) ---
@Component({
  selector: 'document-file-delete-template',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div class="dialog-layout">
      <div class="dialog-header">
        <div class="icon-box danger">
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <div class="header-text">
          <h5 class="title">{{ lang.areYouSureYouWanttoDelete }}</h5>
          <p class="subtitle">Bu dosya kalıcı olarak silinecektir.</p>
        </div>
      </div>
      <div class="dialog-body">
        <div class="alert-box danger">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Bu işlem geri alınamaz.</p>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-ghost" [mat-dialog-close]="false">{{ lang.cancel }}</button>
        <button class="btn-prism-danger" [mat-dialog-close]="true" cdkFocusInitial>
          <div class="sheen"></div>
          <i class="fa-solid fa-trash-can me-2"></i> {{ lang.delete }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-layout { background: white; display: flex; flex-direction: column; max-width: 450px; overflow: hidden; }
    .dialog-header { padding: 1.5rem; background: #fff; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #e2e8f0; }
    .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-box.danger { background: #fef2f2; color: #ef4444; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15); }
    .title { margin: 0; font-weight: 800; font-size: 1.1rem; color: #1e293b; }
    .subtitle { margin: 0; font-size: 0.8rem; color: #64748b; margin-top: 2px; }
    .dialog-body { padding: 1.5rem; background: #f8fafc; }
    .alert-box { padding: 1rem; border-radius: 8px; font-size: 0.9rem; display: flex; gap: 10px; align-items: center; font-weight: 500; }
    .alert-box.danger { background: #fff; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; color: #b91c1c; }
    .dialog-footer { padding: 1rem 1.5rem; background: white; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.8rem; }
    .btn-ghost { border: 1px solid #e2e8f0; background: white; color: #64748b; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 8px; transition: 0.2s; }
    .btn-ghost:hover { background: #f8fafc; color: #1e293b; }
    .btn-prism-danger { position: relative; border: none; overflow: hidden; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; font-weight: 700; padding: 0.6rem 1.5rem; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); transition: 0.2s; }
    .btn-prism-danger:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(239, 68, 68, 0.4); }
    .sheen { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0)); transform: skewX(-25deg); animation: shine 3s infinite; }
    @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
  `]
})
export class DocumentFileDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(public dialogRef: MatDialogRef<DocumentFileDeleteTemplate>) { }
}

@Component({
  selector: 'reset-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div class="dialog-layout">
      <div class="dialog-header">
        <div class="icon-box info">
          <i class="fa-solid fa-arrows-rotate"></i>
        </div>
        <div class="header-text">
          <h5 class="title">Görünümü Sıfırla</h5>
          <p class="subtitle">Tablo ayarlarınız varsayılana dönecek.</p>
        </div>
      </div>
      <div class="dialog-body">
        <div class="alert-box info">
          <i class="fa-solid fa-circle-info"></i>
          <p>Filtreler ve sıralamalar temizlenecektir.</p>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-ghost" [mat-dialog-close]="false">İptal</button>
        <button class="btn-prism-info" [mat-dialog-close]="true">
          <div class="sheen"></div>
          <i class="fa-solid fa-check me-2"></i> Sıfırla
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Reusing styles for consistency */
    .dialog-layout { background: white; display: flex; flex-direction: column; max-width: 450px; overflow: hidden; }
    .dialog-header { padding: 1.5rem; background: #fff; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #e2e8f0; }
    .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-box.info { background: #e0f2f1; color: #26a69a; box-shadow: 0 2px 8px rgba(38, 166, 154, 0.15); }
    .title { margin: 0; font-weight: 800; font-size: 1.1rem; color: #1e293b; }
    .subtitle { margin: 0; font-size: 0.8rem; color: #64748b; margin-top: 2px; }
    .dialog-body { padding: 1.5rem; background: #f8fafc; }
    .alert-box { padding: 1rem; border-radius: 8px; font-size: 0.9rem; display: flex; gap: 10px; align-items: center; font-weight: 500; }
    .alert-box.info { background: #fff; border: 1px solid #b2dfdb; border-left: 4px solid #26a69a; color: #1e293b; }
    .dialog-footer { padding: 1rem 1.5rem; background: white; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.8rem; }
    .btn-ghost { border: 1px solid #e2e8f0; background: white; color: #64748b; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 8px; transition: 0.2s; }
    .btn-ghost:hover { background: #f8fafc; color: #1e293b; }
    .btn-prism-info { position: relative; border: none; overflow: hidden; background: linear-gradient(135deg, #203b46 0%, #37474f 100%); color: white; font-weight: 700; padding: 0.6rem 1.5rem; border-radius: 8px; display: flex; align-items: center; box-shadow: 0 4px 10px rgba(32, 59, 70, 0.3); transition: 0.2s; }
    .btn-prism-info:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(32, 59, 70, 0.4); }
    .sheen { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0)); transform: skewX(-25deg); animation: shine 3s infinite; }
    @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
  `]
})
export class ResetConfirmDialog {
  constructor(public dialogRef: MatDialogRef<ResetConfirmDialog>) { }
}