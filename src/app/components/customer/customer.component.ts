import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core'; 
import { AgGridAngular } from 'ag-grid-angular';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { CustomerComponentService } from '../../services/component/customer-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent, FirstDataRenderedEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { Customer } from '../../models/customers/cusotmers';
import { NavbarCustomerComponent } from './navbar-customer/navbar-customer.component';
import { AgPersist } from '../../ag-persist';
import { ToastrService } from 'ngx-toastr';

// Import your Dialog Components
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { ViewCustomerComponent } from './viewCustomerComponent';

@Component({
    selector: 'app-customer',
    standalone: true,
    // Imports are still needed for standalone, but we won't use them in HTML
    imports: [CommonModule, AgGridAngular, NavbarCustomerComponent, MatDialogModule, MatButtonModule],
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    customerDelete: boolean = false;
    customer: Customer
    lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
    dataLoaded: boolean = false;
    
    constructor(
        private customerComponentService: CustomerComponentService, 
        private toastrService: ToastrService, 
        private dialog: MatDialog
    ) { }

    gridApi: any;
    
    // --- COLUMN DEFINITIONS (Cleaned up) ---
    public columnDefs: (ColDef | ColGroupDef)[] = [
        { field: 'name', headerName: this.lang.customerName, unSortIcon: false, },
        { field: 'companyName', headerName: this.lang.companyName, unSortIcon: false, },
        { field: 'email', headerName: this.lang.email, unSortIcon: false },
        { field: 'phoneNumber', headerName: this.lang.phoneNumber, unSortIcon: false },
        { field: 'city', headerName: this.lang.city, unSortIcon: false },
        { field: 'status', headerName: this.lang.status, unSortIcon: false },
        { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false },
        {
            headerName: this.lang.delete, 
            field: 'Delete', 
            filter: false, 
            width: 90,
            cellRenderer: () => {

                return `<div class="d-flex justify-content-center"><i class="fa-solid fa-trash-can" style="cursor:pointer;"></i></div>`;
            },
            onCellClicked: (event: CellClickedEvent) => this.deleteCustomer(event.data.id),
        },
        {
            headerName: this.lang.update, 
            field: 'Update', 
            filter: false, 
            width: 90,
            cellRenderer: () => {
                // CSS Class handles the styling 
                return `<div class="d-flex justify-content-center"><i class="fa-solid fa-pen" style="cursor:pointer;"></i></div>`;
            },
            onCellClicked: (event: CellClickedEvent) => {
                // Open the Update Dialog directly
                this.openUpdateDialog(event.data);
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
    public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' = 'infinite';
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
    
    private agPersist = new AgPersist('customerPersist');
    public gridOptions = this.agPersist.setup({
        pagination: true,
        paginationPageSize: 50,
        rowHeight: 40, 
        headerHeight: 40
    });

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.getAllCustomer();
    }

    onFirstDataRendered(params: FirstDataRenderedEvent) {
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }

    // --- DATA METHODS ---

    async getAllCustomer() {
        this.rowData = (await this.customerComponentService.getAllCustomer())
        changeDataTableHeight()
        window.addEventListener("resize", changeDataTableHeight)
        this.dataLoaded = true;
    }

    async getById(id: string) {
        return await this.customerComponentService.getById(id);
    }


    openAddDialog() {
        const dialogRef = this.dialog.open(AddCustomerComponent, { 
            width: '700px', 
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.getAllCustomer();
                this.toastrService.success( 'Başarılı');
            }
        });
    }

    // 2. Open UPDATE Dialog
    openUpdateDialog(customer: Customer) {
        const dialogRef = this.dialog.open(UpdateCustomerComponent, { 
            width: '700px',
            panelClass: 'custom-dialog-container',
            data: customer
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.getAllCustomer();
            }
        });
    }

    deleteCustomer(id: string) {
        this.openDeleteDialog().afterClosed().subscribe(async result => {
            if (!result) return;
            this.customerComponentService.deleteCustomer(id, () => { this.getAllCustomer() })
        })
    }

    openDeleteDialog() {
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
}

@Component({
    selector: 'customer-delete-template',
    template: `
  <h5 mat-dialog-title>{{lang.areYouSureYouWanttoDelete}}</h5>
   <div mat-dialog-content></div>
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
    constructor(public dialogRef: MatDialogRef<CustomerDeleteTemplate>) {}
}

@Component({
  selector: 'customer-reset-confirm-dialog',
  template: `
  <h5 mat-dialog-title>Görünümü Sıfırlama Onayı</h5>
  <div mat-dialog-content>
    <p>Kaydedilmiş tüm sütun genişlikleri, sıralama ve filtre ayarları silinecektir.</p>
    <p>Devam etmek istediğinizden emin misiniz?</p>
  </div>
  <div mat-dialog-actions class="mat-mdc-dialog-actions">
    <button class="button-4" mat-button [mat-dialog-close]="false">
      <i class="fa-solid fa-circle-xmark"></i> {{  'İptal' }}
    </button>
    <button class="button-24" mat-button [mat-dialog-close]="true" cdkFocusInitial>
      <i class="fa-solid fa-check"></i> {{ 'Sıfırla' }}
    </button>
  </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class CustomerResetConfirmDialog {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  constructor(public dialogRef: MatDialogRef<CustomerResetConfirmDialog>) { }
}