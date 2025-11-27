import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 

// Services & Models
import { AggrementComponentService } from '../../services/component/aggrement-component.service';
import { Aggrement } from '../../models/aggrements/aggrement';

// Dialog Components
import { AddAgreementComponent } from './add-agreement/add-agreement.component';
import { AgreementDetailDialogComponent } from './aggrement-detail-dialog/aggrement-detail-dialog.component';

@Component({
  selector: 'app-agreements',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatDialogModule], 
  templateUrl: './agreements.component.html',
  styleUrl: './agreements.component.css'
})
export class AgreementsComponent implements OnInit {
  
  rowData: Aggrement[] = [];
  private gridApi!: GridApi<Aggrement>;

  // Grid Config
  cacheBlockSize = 100;
  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 1;
  infiniteInitialRowCount = 100;
  maxBlocksInCache = 10;
  noRowsTemplate = `<span style="color: var(--text-sub);">Henüz bir sözleşme kaydı bulunmamaktadır.</span>`;

  public columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', hide: true },
    
    // 1. CUSTOMER NAME COLUMN (Since backend maps Name to 'customerId' field)
    { 
      headerName: 'MÜŞTERİ', 
      field: 'customerId', 
      flex: 1,
      cellStyle: { fontWeight: '500', color: '#64748b' }
    },

    { 
      headerName: 'SÖZLEŞME BAŞLIĞI', 
      field: 'aggrementTitle', 
      flex: 2,
      cellStyle: { fontWeight: '600', color: '#1e293b' }
    }, 

    { 
      headerName: 'TOPLAM TUTAR', 
      field: 'agreedAmount', 
      flex: 1, 
      valueFormatter: params => params.value ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value) : '-',
      cellStyle: { fontWeight: 'bold' } 
    },

    // 2. REMAINING BALANCE COLUMN (Calculated)
    { 
      headerName: 'KALAN ALACAK', 
      flex: 1,
      // Calculate: Agreed - Paid
      valueGetter: params => {
        if(!params.data) return 0;
        return (params.data.agreedAmount || 0) - (params.data.paidAmount || 0);
      },
      valueFormatter: params => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value),
      cellStyle: params => {
        // Red if debt exists (>0), Green if paid (<=0)
        if (params.value > 0) return { color: '#ef4444', fontWeight: 'bold' };
        return { color: '#26a69a', fontWeight: 'bold' };
      }
    },

    { 
      headerName: 'BİTİŞ TARİHİ', 
      field: 'expirationDate', 
      flex: 1, 
      valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'
    },
    {
      headerName: 'İŞLEMLER',
      field: 'action',
      width: 100, 
      pinned: 'right',
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        return `
          <div style="display: flex; gap: 12px; justify-content: center; align-items: center; height: 100%;">
            <i class="fa-solid fa-eye action-btn-view" title="Detaylar" style="cursor:pointer; color: #3b82f6; font-size: 1.1rem;"></i>
            <i class="fa-solid fa-trash-can action-btn-delete" title="Sil" style="cursor:pointer; color: #ef4444; font-size: 1.1rem;"></i>
          </div>
        `;
      }
    }
  ];

  public defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  public gridOptions: any = { rowHeight: 48, headerHeight: 40, pagination: true, paginationPageSize: 20 };

  constructor(
    private agreementService: AggrementComponentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAgreement();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.addEventListener('cellClicked', (event: CellClickedEvent) => {
      const target = event.event?.target as HTMLElement;
      if (target.classList.contains('action-btn-view')) {
        this.openDetailDialog(event.data.id); 
      } 
      else if (target.classList.contains('action-btn-delete')) {
        this.deleteAgreement(event.data.id);
      }
    });
  }

  resetParameters() {
    this.gridApi.setFilterModel(null);
    this.gridApi.deselectAll();
    this.getAllAgreement();
  }

  async getAllAgreement() {
    this.rowData = await this.agreementService.getAllAggrement();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAgreementComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getAllAgreement();
    });
  }

  openDetailDialog(id: string) {
    this.dialog.open(AgreementDetailDialogComponent, {
      width: '950px', 
      data: id, 
      autoFocus: false,
      panelClass: 'custom-dialog-panel' 
    });
  }

  async deleteAgreement(id: string) {
    if(confirm('Silmek istediğinize emin misiniz?')) {
      await this.agreementService.deleteAggrement(id, () => {
        this.getAllAgreement();
      });
    }
  }
}