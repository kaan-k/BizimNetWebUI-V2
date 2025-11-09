import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { DeviceComponentService } from '../../services/component/device-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Device } from '../../models/devices/device';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { NavbarDeviceComponent } from './navbar-device/navbar-device.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { changeDataTableHeight } from '../../../assets/js/main';
import { UpdateDeviceComponent } from './update-device/update-device.component';
import { AgPersist } from '../../ag-persist';
import { CustomerResetConfirmDialog } from '../customer/customer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NavbarDeviceComponent, AddDeviceComponent, UpdateDeviceComponent],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  device: Device
  dataLoaded: boolean = false;

  constructor(private deviceComponentService: DeviceComponentService,private toastrService: ToastrService, private dialog: MatDialog) { }



  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'name', headerName: this.lang.deviceName, unSortIcon: true, },
    { field: 'deviceType', headerName: this.lang.deviceType, unSortIcon: true, },
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: false },
    { field: 'anyDeskId', headerName: this.lang.anyDeskId, unSortIcon: false },
    { field: 'publicIp', headerName: this.lang.publicIp, unSortIcon: false },
    { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false },
    { field: 'updatedAt', headerName: this.lang.updatedAt, unSortIcon: false },
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.deleteDevice(event.data.id),
    },
    {
      field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
        return 'Update';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#deviceUpdateModal"></i>`;
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


  //AG PERSIST SETUP
  private agPersist = new AgPersist('devicePersist');
  public gridOptions = this.agPersist.setup({
    pagination: true,
    paginationPageSize: 50,
  });

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllDevice()
  }

      resetParameters(): void {
          const dialogRef = this.dialog.open(CustomerResetConfirmDialog, {
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

  async getAllDevice() {
    this.rowData = await this.deviceComponentService.getAllDevice();
    changeDataTableHeight()
    window.addEventListener("resize", changeDataTableHeight)
    this.dataLoaded = true;
  }
  async getById(id: string) {
    return this.device = await this.deviceComponentService.getById(id);
  }
  deleteDevice(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) {
        return
      }
      this.deviceComponentService.deleteDevice(id, () => { this.getAllDevice() })
    })
  }
  openDialog() {
    return this.dialog.open(DeviceDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
}
@Component({
  selector: 'device-delete-template',
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
export class DeviceDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<DeviceDeleteTemplate>) {
  }
}
