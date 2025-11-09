import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { ServicingComponentService } from '../../services/component/servicing-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { MatButtonModule } from '@angular/material/button';
import { NavbarServicingComponent } from './navbar-servicing/navbar-servicing.component';
import { AddServicingComponent } from './add-servicing/add-servicing.component';
import { Servicing } from '../../models/servicing/servicing';
import { AddDeviceComponent } from './add-device/add-device.component';

@Component({
  selector: 'app-servicing',
  standalone: true,
  imports: [CommonModule, AgGridModule,NavbarServicingComponent,AddServicingComponent,AddDeviceComponent],
  templateUrl: './servicing.component.html',
  styleUrl: './servicing.component.css'
})
export class ServicingComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  servicing:Servicing
  constructor(private servicingComponentService: ServicingComponentService, private dialog: MatDialog) { }

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: true, }, 
    { field: 'name', headerName: this.lang.servicingName, unSortIcon: false},
    { field: 'trackingId', headerName: this.lang.trackingId, unSortIcon: false},
    { field: 'status', headerName: this.lang.status, unSortIcon: false},
    { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false},
    { field: 'updatedAt', headerName: this.lang.updatedAt, unSortIcon: false},
    { field: 'lastAction', headerName: this.lang.lastAction, unSortIcon: false},
    { field: 'lastActionDate', headerName: this.lang.lastActionDate, unSortIcon: false},
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
      field: 'markAsInProgress', headerName: this.lang.markAsInProgress, filter: false, valueGetter: (params) => {
        return 'markAsInProgress';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-thumbs-down"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.markAsInProgress(event.data.id),
    }, 
     {
      field: 'DeviceUpdate', headerName: this.lang.DeviceUpdate, filter: false, valueGetter: (params) => {
        return 'DeviceUpdate';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#servicingDeviceAddModal"></i>`;
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
      suppressMenu: true,
      minWidth: 80,
      suppressSizeToFit: true,
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
    this.getAllServicing()
  }

  async getAllServicing() {
    this.rowData = await this.servicingComponentService.getAllServicing();
    changeDataTableHeight()
    window.addEventListener("resize", changeDataTableHeight)
  }
  async markAsCompleted(id: string) {
    await this.servicingComponentService.markAsCompleted(id);
    this.getAllServicing();
  }
  async getById(id: string) {
    this.servicing = await this.servicingComponentService.getById(id);
  }
  async markAsInProgress(id: string) {
    await this.servicingComponentService.markAsInProgress(id);
    this.getAllServicing();
  }
  deleteServicing(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) {
        return
      }
      this.servicingComponentService.deleteServicing(id, () => { this.getAllServicing() })
    })
  }
  openDialog() {
    return this.dialog.open(ServicingDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
}
@Component({
  selector: 'servicing-delete-template',
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
export class ServicingDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<ServicingDeleteTemplate>) {
  }
}