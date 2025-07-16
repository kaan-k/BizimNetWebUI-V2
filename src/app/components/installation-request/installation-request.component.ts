import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { InstallationRequest } from '../../models/installationRequest/installationRequest';
import { InstallationRequestComponentService } from '../../services/component/installation-request-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { AgGridAngular } from 'ag-grid-angular';
import { NavbarInstallationRequestComponent } from './navbar-installation-request/navbar-installation-request.component';
import { AddInstallationRequestComponent } from './add-installation-request/add-installation-request.component';
import { UpdateInstallationRequestComponent } from './update-installation-request/update-installation-request.component';

@Component({
  selector: 'app-installation-request',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NavbarInstallationRequestComponent, AddInstallationRequestComponent, UpdateInstallationRequestComponent],
  templateUrl: './installation-request.component.html',
  styleUrl: './installation-request.component.css'
})
export class InstallationRequestComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  installationRequest: InstallationRequest
  installationRequestDelete: boolean = false;
  dataLoaded: boolean = false;
  constructor(private installationRequestComponentService: InstallationRequestComponentService, private dialog: MatDialog) { }

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'offerId', headerName: this.lang.offerName, unSortIcon: true, },
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: true, },
    { field: 'assignedEmployeeId', headerName: this.lang.assignedEmployeeName, unSortIcon: true },
    { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: true },
    { field: 'finishedAt', headerName: this.lang.finishedAt, unSortIcon: true },
    { field: 'lastUpdatedAt', headerName: this.lang.lastUpdatedAt, unSortIcon: true },
    { field: 'isAssigned', headerName: this.lang.isAssigned, unSortIcon: true },
    { field: 'isCompleted', headerName: this.lang.isCompleted, unSortIcon: true },
    { field: 'installationNote', headerName: this.lang.installationNote, unSortIcon: true },
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.deleteInstallationRequest(event.data.id),
    },
    {
      field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
        return 'Update';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#installationRequestUpdateModal"></i>`;
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
    this.getAllInstallationRequest()
  }

  async getAllInstallationRequest() {
    this.rowData = await this.installationRequestComponentService.getAllInstallationRequest();
    changeDataTableHeight()
    window.addEventListener("resize", changeDataTableHeight)
    this.dataLoaded = true;
  }
  async getById(id: string) {
    this.installationRequest = await this.installationRequestComponentService.getById(id);
  }

  deleteInstallationRequest(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) {
        return
      }
      this.installationRequestComponentService.deleteInstallationRequest(id, () => { this.getAllInstallationRequest() })
    })
  }
  openDialog() {
    return this.dialog.open(InstallationRequestDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }

}
@Component({
  selector: 'installaton-request-delete-template',
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
export class InstallationRequestDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<InstallationRequestDeleteTemplate>) {
  }
}
