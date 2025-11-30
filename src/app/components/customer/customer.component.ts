import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { CustomerComponentService } from '../../services/component/customer-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// NEW: Import MatMenu modules
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent, FirstDataRenderedEvent, CellContextMenuEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { Customer } from '../../models/customers/cusotmers';
import { NavbarCustomerComponent } from './navbar-customer/navbar-customer.component';
import { AgPersist } from '../../ag-persist';
import { ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
// Import your Dialog Components
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { ViewCustomerComponent } from './viewCustomerComponent';
import { CustomerDeleteTemplate } from './delete-customer/delete-customer.component';
import { CustomerOperationsComponent } from './customer-operations/customer-operations.component';
import { CustomerActionsComponent } from './customer-actions/customer-actions.component';

@Component({
    selector: 'app-customer',
    standalone: true,
    // NEW: Added MatMenuModule to imports
    imports: [CommonModule, AgGridAngular, NavbarCustomerComponent, MatDialogModule, MatButtonModule, MatMenuModule, MatDividerModule],
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    customerDelete: boolean = false;
    customer: Customer
    lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
    dataLoaded: boolean = false;

    // NEW: Context Menu Properties
    @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
    contextMenuData: Customer | null = null; // Stores the row data clicked on

    constructor(
        private customerComponentService: CustomerComponentService,
        private toastrService: ToastrService,
        private dialog: MatDialog
    ) { }

    gridApi: any;

    // --- COLUMN DEFINITIONS ---
    public columnDefs: (ColDef | ColGroupDef)[] = [
        { field: 'name', headerName: this.lang.customerName, unSortIcon: false, },
        { field: 'companyName', headerName: this.lang.companyName, unSortIcon: false, },
        { field: 'email', headerName: this.lang.email, unSortIcon: false },
        { field: 'phoneNumber', headerName: this.lang.phoneNumber, unSortIcon: false },
        { field: 'city', headerName: this.lang.city, unSortIcon: false },
        { field: 'status', headerName: this.lang.status, unSortIcon: false },
        {
            field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false, valueFormatter: params => {
                if (!params.value) return '';
                return new Date(params.value).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        },
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
                return `<div class="d-flex justify-content-center"><i class="fa-solid fa-pen" style="cursor:pointer;"></i></div>`;
            },
            onCellClicked: (event: CellClickedEvent) => {
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

    // --- NEW: Context Menu Logic ---
    onCellContextMenu(event: CellContextMenuEvent) {
        const mouseEvent = event.event as MouseEvent;

        // 1. Prevent standard browser context menu
        mouseEvent.preventDefault();

        // 2. Store the data of the row being clicked
        this.contextMenuData = event.data;

        // 3. Set position for the menu trigger
        this.contextMenuPosition.x = mouseEvent.clientX + 'px';
        this.contextMenuPosition.y = mouseEvent.clientY + 'px';

        // 4. Trigger the menu open (using timeout to allow UI to update position first)
        if (this.contextMenuTrigger) {
            // We use a slight delay to ensure the div has moved to the cursor position
            setTimeout(() => {
                this.contextMenuTrigger.openMenu();
            }, 0);
        }
    }

    onContextMenuAction(action: string) {
        console.log(`Action: ${action} triggered for customer:`, this.contextMenuData.companyName);

        if (action === 'cari-islemler') {
      // --- OPEN THE ACTIONS MENU (The new component) ---
      this.dialog.open(CustomerActionsComponent, {
        width: '500px',
        panelClass: 'custom-dialog-container',
        data: this.contextMenuData, // Pass the customer data
        autoFocus: false
      });
    } 
    else if (action === 'cari-hareketler') {
      // --- OPEN THE HISTORY/TABS ---
      this.dialog.open(CustomerOperationsComponent, {
        width: '850px',
        panelClass: 'custom-dialog-container',
        data: this.contextMenuData,
        autoFocus: false
      });
    }
    else if (action === 'delete') {
      this.deleteCustomer(this.contextMenuData.id);
    }
    else if (action === 'view') {
      this.openViewDialog(this.contextMenuData);
    }
    else if (action === 'update') {
      this.openUpdateDialog(this.contextMenuData);
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
                this.toastrService.success('Başarılı');
            }
        });
    }

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

// --- SUB COMPONENTS ---

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