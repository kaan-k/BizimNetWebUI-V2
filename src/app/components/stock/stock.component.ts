import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core'; 
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent, FirstDataRenderedEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { StockComponentService } from '../../services/component/stock-component.service';
import { Stock } from '../../models/stock/stock'; 
import { AgPersist } from '../../ag-persist';
import { ToastrService } from 'ngx-toastr';

// Dialogs
import { AddStockComponent } from './add-stock/add-stock.component';
import { UpdateStockComponent } from './update-stock/update-stock.component';

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [CommonModule, AgGridAngular, MatDialogModule, MatButtonModule],
    templateUrl: './stock.component.html',
    styleUrl: './stock.component.css'
})
export class StockComponent {
    
    rowData: Stock[] = [];
    private gridApi!: any;
    dataLoaded: boolean = false;
    
    constructor(
        private stockComponentService: StockComponentService, 
        private toastrService: ToastrService, 
        private dialog: MatDialog
    ) { }

    // --- COLUMN DEFINITIONS ---
    public columnDefs: (ColDef | ColGroupDef)[] = [
        { field: 'id', headerName: 'ID', hide: true },
        { field: 'name', headerName: 'Stok Adı', flex: 2, unSortIcon: false },
        { 
            field: 'quantity', 
            headerName: 'Miktar', 
            flex: 1,
            cellStyle: { fontWeight: 'bold', color: '#26a69a' } // Teal for numbers
        },
        { 
            field: 'deviceType', 
            headerName: 'Cihaz Tipi', 
            flex: 1,
            // You might want a valueFormatter here if it's an Enum (e.g. 0 -> 'Laptop')
        },
        { 
            field: 'purchaseDate', 
            headerName: 'Satın Alma Tarihi', 
            flex: 1,
            valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'
        },
        {
            headerName: 'Sil', 
            field: 'Delete', 
            filter: false, 
            width: 90,
            cellRenderer: () => {
                return `<div class="d-flex justify-content-center"><i class="fa-solid fa-trash-can" style="cursor:pointer;"></i></div>`;
            },
            onCellClicked: (event: CellClickedEvent) => this.deleteStock(event.data.id),
        },
        {
            headerName: 'Güncelle', 
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
    
    public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' = 'infinite';
    public cacheBlockSize = 300;
    public cacheOverflowSize = 2;
    public maxConcurrentDatasourceRequests = 1;
    public infiniteInitialRowCount = 1000;
    public maxBlocksInCache = 10;
    public noRowsTemplate = `<span style="color: var(--text-sub);">Henüz stok kaydı bulunmamaktadır.</span>`;
    
    private agPersist = new AgPersist('stockPersist');
    public gridOptions = this.agPersist.setup({
        pagination: true,
        paginationPageSize: 50,
        rowHeight: 40,
        headerHeight: 40
    });

    // --- GRID EVENTS ---

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.getAllStocks();
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

    resetParameters(): void {
        // You can reuse your existing ResetConfirmDialog here
        // Assuming you import it or create a shared one
        if(confirm('Görünümü sıfırlamak istiyor musunuz?')) {
             this.agPersist.resetGridSettings();
             this.toastrService.success('Görünüm sıfırlandı.');
             window.location.reload();
        }
    }

    // --- DATA METHODS ---

    async getAllStocks() {
        // Assuming your service has getAll() returning ListResponseModel
        // Or if you only have 'GetByDeviceType', you might need a general GetAll in backend.
        // For now, let's assume standard getAll pattern:
        // this.rowData = (await this.stockComponentService.getAll()).data; 
        
        // Placeholder until you confirm backend GetAll exists:
        console.warn("Ensure StockService has GetAll method");
        changeDataTableHeight();
    }

    deleteStock(id: string) {
        if(confirm('Bu stoğu silmek istediğinize emin misiniz?')) {
            this.stockComponentService.deleteStock(id, () => { 
                this.getAllStocks(); 
            });
        }
    }

    // --- DIALOGS ---

    openAddDialog() {
        const dialogRef = this.dialog.open(AddStockComponent, { 
            width: '600px', 
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.getAllStocks();
                this.toastrService.success('Stok eklendi.');
            }
        });
    }

    openUpdateDialog(stock: Stock) {
        const dialogRef = this.dialog.open(UpdateStockComponent, { 
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: stock
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.getAllStocks();
            }
        });
    }
}