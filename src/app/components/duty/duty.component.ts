import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { Duty } from '../../models/duties/duty';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DutyComponentService } from '../../services/component/duty-component.service';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UpdateDutyComponent } from './update-duty/update-duty.component';
import { NavbarDutyComponent } from './navbar-duty/navbar-duty.component';
import { AddDutyComponent } from './add-duty/add-duty.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ViewDutyComponent } from './viewDutyComponent';
import { AgPersist } from '../../ag-persist';

@Component({
  selector: 'app-duty',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    NavbarDutyComponent,
    UpdateDutyComponent,
    AddDutyComponent,
    ViewDutyComponent,

  ],
  templateUrl: './duty.component.html',
  styleUrl: './duty.component.css'
})
export class DutyComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  duty!: Duty;
  dutyDelete: boolean = false;
  dataLoaded: boolean = false;

  constructor(private dutyComponentService: DutyComponentService, private toastrService: ToastrService, private dialog: MatDialog) { }


  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: false},
    { field: 'name', headerName: this.lang.name, unSortIcon: false},
    { field: 'description', headerName: this.lang.description, unSortIcon: false},
    { field: 'assignedEmployeeId', headerName: "Atanan Kişi", unSortIcon: false},
{
  field: 'deadline',
  headerName: this.lang.deadline,
  unSortIcon: true,
  valueFormatter: params => {
    if (!params.value) return '';
    return new Date(params.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
},  {
  field: 'createdAt',
  headerName: "Oluşturulma Tarihi",
  unSortIcon: true,
  valueFormatter: params => {
    if (!params.value) return '';
    return new Date(params.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
},
    {
  field: 'completedAt',
  headerName: "Tamamlanma Tarihi",
  unSortIcon: true,
  valueFormatter: params => {
    if (!params.value) return '';
    return new Date(params.value).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
},
    { field: 'priority', headerName: this.lang.priority, unSortIcon: false},
    { field: 'status', headerName: this.lang.status, unSortIcon: false},
    { field: 'createdBy', headerName: "Oluşturan", unSortIcon: false},
    { field: 'completedBy', headerName: "Tamamlayan", unSortIcon: false},

    {
      field: 'markAsCompleted', headerName: this.lang.markAsCompleted, filter: false, valueGetter: (params) => {
        return 'markAsCompleted';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-thumbs-up"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.markAsCompleted(event.data.id),
    },
    {
      field: 'Update', headerName: this.lang.update, filter: false, valueGetter: () => 'Update',
      cellRenderer: () => `<i class="fa-solid fa-pen" style="cursor:pointer;opacity:0.7;font-size:20px;" data-bs-toggle="modal" data-bs-target="#dutyUpdateModal"></i>`,
      onCellClicked: (event: CellClickedEvent) => this.getById(event.data.id)
    },
    {
      field: 'View',
      headerName: this.lang.view,
      cellStyle: { 'text-align': 'center' },
      filter: false,
      valueGetter: () => 'View',
      cellRenderer: () =>
        `<i class="fa-solid fa-eye" style="cursor:pointer;opacity:0.7;font-size:20px;"></i>`,
      
      onCellClicked: (event: CellClickedEvent) => this.openViewDialog(event.data),
    },
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: () => 'Delete',
      cellRenderer: () => `<i class="fa-solid fa-trash-can" style="cursor:pointer;opacity:0.7;font-size:20px;"></i>`,
      onCellClicked: (event: CellClickedEvent) => this.deleteDuty(event.data.id),
    }
  ];

  public rowSelection = 'multiple';
  public defaultColDef: ColDef = {
      flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
      floatingFilter: true,
      suppressMenu: true,
      minWidth: 80,
      suppressSizeToFit: true,
    };

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

  //AG PERSIST SETUP
  private agPersist = new AgPersist('dutyPersist');
  public gridOptions = this.agPersist.setup({
    pagination: true,
    paginationPageSize: 50,
  });

  

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllDuty();
  }
resetParameters(): void {
    const dialogRef = this.dialog.open(ResetConfirmDialog, {
        width: '450px',
        panelClass: 'matdialog-confirm',
    });
    

    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            this.agPersist.resetGridSettings();
            this.toastrService.success('Grid görünümü başarıyla sıfırlandı.', 'Sayfayı yeniden yükleyin.');
            window.location.reload();
            
        }
    });
}
  async getAllDuty() {
    this.rowData = await this.dutyComponentService.getAllDuty();
    changeDataTableHeight();
    window.addEventListener("resize", changeDataTableHeight);
    this.dataLoaded = true;
  }

  async getById(id: string) {
    this.duty = await this.dutyComponentService.getById(id);
  }
  async markAsCompleted(id: string) {
  try {
    const res = await this.dutyComponentService.markAsCompleted(id);
    if (res.success) this.toastrService.success(res.message);
    else this.toastrService.error(res.message);
    this.getAllDuty();
  } catch { this.toastrService.error('Bu görev zaten tamamlanmış.'); }
}
  deleteDuty(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) return;
      this.dutyComponentService.deleteDuty(id, () => this.getAllDuty());
    });
  }
  openDialog() {
    return this.dialog.open(DutyDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
  openViewDialog(duty: Duty) {
    this.dialog.open(ViewDutyComponent, {
      width: '600px',
      data: duty,
      panelClass: 'matdialog-view'
    });
  }

}
@Component({
  selector: 'offer-delete-template',
  template: `
  <h5 mat-dialog-title>{{lang.areYouSureYouWanttoDelete}}</h5>
  <div mat-dialog-content></div>
  <div mat-dialog-actions class="mat-mdc-dialog-actions">
    <button class="button-4" mat-button [mat-dialog-close]=false>
      <i class="fa-solid fa-circle-xmark"></i> {{lang.cancel}}
    </button>
    <button class="button-24" mat-button [mat-dialog-close]=true cdkFocusInitial>
      <i class="fa-solid fa-trash-can"></i> {{lang.delete}}
    </button>
  </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class DutyDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(public dialogRef: MatDialogRef<DutyDeleteTemplate>) { }
}

@Component({
  selector: 'reject-reason-dialog',
  template: `
    <h5 mat-dialog-title>{{lang.rejectionReason}}</h5>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>{{lang.rejectionReason}}</mat-label>
        <textarea matInput [(ngModel)]="reason" rows="3"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="mat-mdc-dialog-actions">
      <button mat-button class="button-4" [mat-dialog-close]="null">
        <i class="fa-solid fa-circle-xmark"></i> {{lang.cancel}}
      </button>
      <button mat-button class="button-24" [mat-dialog-close]="reason" cdkFocusInitial>
        <i class="fa-solid fa-check"></i> {{lang.approve}}
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
})
export class RejectReasonDialog {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  reason: string = '';
  constructor(public dialogRef: MatDialogRef<RejectReasonDialog>) { }
}

@Component({
  selector: 'reset-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div class="dialog-layout">
      
      <div class="dialog-header">
        <div class="icon-box">
          <i class="fa-solid fa-arrows-rotate"></i>
        </div>
        <div class="header-text">
          <h5 class="title">Görünümü Sıfırla</h5>
          <p class="subtitle">Tablo ayarlarınız varsayılana dönecek.</p>
        </div>
      </div>

      <div class="dialog-body">
        <div class="alert-box">
          <i class="fa-solid fa-circle-info text-accent"></i>
          <p>Kaydedilmiş tüm <strong>sütun genişlikleri</strong>, <strong>sıralama</strong> ve <strong>filtre</strong> ayarları silinecektir.</p>
        </div>
        <p class="confirmation-text">Devam etmek istediğinizden emin misiniz?</p>
      </div>

      <div class="dialog-footer">
        <button class="btn-ghost" [mat-dialog-close]="false">
          {{ 'İptal' }}
        </button>
        
        <button class="btn-prism" [mat-dialog-close]="true" cdkFocusInitial>
          <div class="sheen"></div>
          <i class="fa-solid fa-check me-2"></i> {{ 'Sıfırla' }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* --- THEME VARIABLES --- */
    :host {
      --primary: #203b46;
      --accent: #26a69a;
      --bg-gray: #f8f9fa;
      --border: #e2e8f0;
      --text-main: #1e293b;
      --text-sub: #64748b;
    }

    /* LAYOUT */
    .dialog-layout {
      background: white;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-width: 450px;
    }

    /* HEADER */
    .dialog-header {
      padding: 1.5rem;
      background: #fff;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .icon-box {
      width: 48px; height: 48px;
      background: #e0f2f1; /* Light Teal Bg */
      color: var(--accent);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 10px rgba(38, 166, 154, 0.15);
    }
    
    /* Subtle rotation animation for the icon on hover */
    .dialog-header:hover .icon-box i {
        transform: rotate(180deg);
        transition: transform 0.5s ease;
    }

    .title { margin: 0; font-weight: 800; font-size: 1.1rem; color: var(--text-main); }
    .subtitle { margin: 0; font-size: 0.8rem; color: var(--text-sub); margin-top: 2px; }

    /* BODY */
    .dialog-body { padding: 1.5rem; background: var(--bg-gray); }

    .alert-box {
      background: #fff;
      border: 1px solid #b2dfdb;
      border-left: 4px solid var(--accent);
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      color: var(--text-main);
      margin-bottom: 1rem;
      display: flex; gap: 10px; align-items: start;
    }
    .text-accent { color: var(--accent); margin-top: 3px; }

    .confirmation-text {
        margin: 0; font-weight: 600; color: var(--text-main); font-size: 0.95rem;
    }

    /* FOOTER */
    .dialog-footer {
      padding: 1rem 1.5rem;
      background: white;
      border-top: 1px solid var(--border);
      display: flex; justify-content: flex-end; gap: 0.8rem;
    }

    /* BUTTONS */
    .btn-ghost {
      border: 1px solid var(--border); background: white;
      color: var(--text-sub); font-weight: 600; padding: 0.6rem 1.2rem;
      border-radius: 8px; cursor: pointer; transition: 0.2s;
    }
    .btn-ghost:hover { background: var(--bg-gray); color: var(--text-main); }

    /* The Prism Button (Teal) */
    .btn-prism {
      position: relative; border: none; overflow: hidden;
      background: linear-gradient(135deg, var(--primary) 0%, #37474f 100%);
      color: white; font-weight: 700; padding: 0.6rem 1.5rem;
      border-radius: 8px; cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center;
      box-shadow: 0 4px 10px rgba(32, 59, 70, 0.3);
    }
    
    .btn-prism:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(32, 59, 70, 0.4);
    }

    .sheen {
      position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
      transform: skewX(-25deg); animation: shine 3s infinite;
    }
    @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
  `]
})
export class ResetConfirmDialog {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(public dialogRef: MatDialogRef<ResetConfirmDialog>) { }
}