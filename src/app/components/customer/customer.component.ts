import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core'; // Keep HostListener import
import { AgGridAngular } from 'ag-grid-angular';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { CustomerComponentService } from '../../services/component/customer-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { Customer } from '../../models/customers/cusotmers';
import { NavbarCustomerComponent } from './navbar-customer/navbar-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { ViewCustomerComponent } from './viewCustomerComponent';
import { FirstDataRenderedEvent } from 'ag-grid-community'; // 👈 NEW IMPORT
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NavbarCustomerComponent, AddCustomerComponent, UpdateCustomerComponent, ViewCustomerComponent, MatDialogModule, MatButtonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  customerDelete: boolean = false;
  customer: Customer
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  dataLoaded: boolean = false;
  constructor(private customerComponentService: CustomerComponentService, private dialog: MatDialog) { }
  protected gridOptions: GridOptions = {
      pagination: true,
      paginationPageSize: 50,
      onCellDoubleClicked: (event: any) => {
    this.openViewDialog(event.data);
  },
    };
  gridApi: any;
  public columnDefs: (ColDef | ColGroupDef)[] = [
      { field: 'name', headerName: this.lang.customerName, unSortIcon: false, },
      { field: 'companyName', headerName: this.lang.companyName, unSortIcon: false, },
      { field: 'email', headerName: this.lang.email, unSortIcon: false},
      { field: 'phoneNumber', headerName: this.lang.phoneNumber, unSortIcon: false},
      { field: 'address', headerName: this.lang.address, unSortIcon: false},
      { field: 'country', headerName: this.lang.country, unSortIcon: false},
      { field: 'taxid', headerName: this.lang.taxid, unSortIcon: false},
      { field: 'city', headerName: this.lang.city, unSortIcon: false},
      { field: 'customerField', headerName: this.lang.customerFields, unSortIcon: false},
      { field: 'status', headerName: this.lang.status, unSortIcon: false},
      { field: 'lastActionDate', headerName: this.lang.lastActionDate, unSortIcon: false},
      { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false},
      { field: 'updatedAt', headerName: this.lang.updatedAt, unSortIcon: false},
      {
        field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
          return 'Delete';
        },
        cellRenderer: () => {
          return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
        },
        onCellClicked: (event: CellClickedEvent) =>
          this.deleteCustomer(event.data.id),
      },
      {
        field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
          return 'Update';
        },
        cellRenderer: () => {
          return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#customerUpdateModal"></i>`;
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
  
    // 👈 Fix 1: Only store the API and load data here.
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.getAllCustomer();
    }

    // 👈 Fix 2: Implement onFirstDataRendered to resize AFTER data is loaded.
    onFirstDataRendered(params: FirstDataRenderedEvent) {
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }
    
    // Keep the HostListener for runtime responsiveness
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }
    
    //#region  Get Method
  
    async getAllCustomer() {
      this.rowData = (await this.customerComponentService.getAllCustomer())
      changeDataTableHeight()
      window.addEventListener("resize", changeDataTableHeight)
      this.dataLoaded = true;
    }  
    
    // ... rest of your methods (getById, deleteCustomer, openDialog, openViewDialog)
    async getById(id: string) {
      this.customer = await this.customerComponentService.getById(id);
    }

    deleteCustomer(id: string) {
        this.openDialog().afterClosed().subscribe(async result => {
            if (!result) {
                return
            }
            this.customerComponentService.deleteCustomer(id, () => { this.getAllCustomer() })
        })
    }
    openDialog() {
        return this.dialog.open(CustomerDeleteTemplate, {
            width: '550px',
            panelClass: 'matdialog-delete',
        });
    }
    openViewDialog(customer: Customer) {
        this.dialog.open(ViewCustomerComponent, {
            width: '600px',
            data: customer,
            panelClass: 'matdialog-view'
        });
    }
}


@Component({
  selector: 'customer-delete-template',
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
export class CustomerDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<CustomerDeleteTemplate>) {
  }
}
//#endregion