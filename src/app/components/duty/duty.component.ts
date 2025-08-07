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

import { UpdateDutyComponent } from './update-duty/update-duty.component';
import { NavbarDutyComponent } from './navbar-duty/navbar-duty.component'; 
import { AddDutyComponent } from './add-duty/add-duty.component';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { ViewDutyComponent } from './viewDutyComponent'; 

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

  constructor(private dutyComponentService: DutyComponentService, private dialog: MatDialog) {}

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: true },
    { field: 'name', headerName: this.lang.name, unSortIcon: true },
    { field: 'description', headerName: this.lang.description, unSortIcon: true },
    { field: 'deadline', headerName: this.lang.deadline, unSortIcon: true },
    { field: 'priority', headerName: this.lang.priority, unSortIcon: true },
    { field: 'status', headerName: this.lang.status, unSortIcon: true },

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
    minWidth: 130,
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

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllDuty();
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
    await this.dutyComponentService.markAsCompleted(id);
    this.getAllDuty();
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
  constructor(public dialogRef: MatDialogRef<DutyDeleteTemplate>) {}
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
  constructor(public dialogRef: MatDialogRef<RejectReasonDialog>) {}
}
