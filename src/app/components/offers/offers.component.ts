import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent, FirstDataRenderedEvent } from 'ag-grid-community';
import { OfferComponentService } from '../../services/component/offer-component.service';
import { OfferDto } from '../../models/offers/offer';
import { AddOfferComponent } from './add-offer/add-offer.component';
// IMPORT VIEW COMPONENT
import { ViewOfferComponent } from './view-offer/view-offer.component'; 
import { changeDataTableHeight } from '../../../assets/js/main';
import { AgPersist } from '../../ag-persist';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatDialogModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {

  rowData: OfferDto[] = [];
  private gridApi!: GridApi;
  
  private agPersist = new AgPersist('offerPersist');

  public columnDefs: ColDef[] = [
    { field: 'id', hide: true },
    { 
      field: 'offerTitle', 
      headerName: 'TEKLİF BAŞLIĞI', 
      flex: 2, 
      cellStyle: { fontWeight: '600', color: '#1e293b' }
    },
    { 
      field: 'customerId', 
      headerName: 'MÜŞTERİ', 
      flex: 1 
    },
    { 
      field: 'totalAmount', 
      headerName: 'TOPLAM TUTAR', 
      flex: 1, 
      valueFormatter: p => p.value ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.value) : '-',
      cellStyle: { fontWeight: 'bold', color: '#26a69a' }
    },
    { 
      field: 'Status', 
      headerName: 'DURUM', 
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        let colorClass = 'badge-secondary';
        let label = status;

        if (status === 'Pending') { colorClass = 'badge-warning'; label = 'Bekliyor'; }
        else if (status === 'Accepted') { colorClass = 'badge-success'; label = 'Onaylandı'; }
        else if (status === 'Rejected') { colorClass = 'badge-danger'; label = 'Reddedildi'; }

        return `<span class="badge ${colorClass}">${label}</span>`;
      }
    },
    { 
      field: 'expirationDate', 
      headerName: 'GEÇERLİLİK', 
      width: 120,
      valueFormatter: p => p.value ? new Date(p.value).toLocaleDateString('tr-TR') : '-' 
    },
    {
      headerName: 'İŞLEMLER',
      field: 'action',
      width: 140,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const showConvert = params.data.Status !== 'Converted';
        
        return `
          <div style="display: flex; gap: 8px; justify-content: center; align-items: center; height: 100%;">
            ${showConvert ? `<i class="fa-solid fa-file-contract action-btn-convert" title="Sözleşmeye Dönüştür" style="cursor:pointer; color: #f59e0b;"></i>` : ''}
            <i class="fa-solid fa-eye action-btn-view" title="Detaylar" style="cursor:pointer; color: #3b82f6;"></i>
            <i class="fa-solid fa-trash-can action-btn-delete" title="Sil" style="cursor:pointer; color: #ef4444;"></i>
          </div>
        `;
      }
    }
  ];

  public defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };
  public gridOptions = this.agPersist.setup({
      pagination: true, 
      paginationPageSize: 20,
      rowHeight: 48, 
      headerHeight: 40 
  });

  constructor(
    private offerService: OfferComponentService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllOffers();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getAllOffers();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    this.gridApi.sizeColumnsToFit();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.gridApi.sizeColumnsToFit();
  }

  onCellClicked(event: any) {
      const target = event.event.target as HTMLElement;
      
      // 1. Convert
      if (target.classList.contains('action-btn-convert')) {
          this.convertToAgreement(event.data);
      }
      // 2. View (ENABLED)
      else if (target.classList.contains('action-btn-view')) {
          this.openViewDialog(event.data);
      }
      // 3. Delete
      else if (target.classList.contains('action-btn-delete')) {
          // this.deleteOffer(event.data.id);
      }
  }

  async getAllOffers() {
    this.rowData = await this.offerService.getAllOffer();
    changeDataTableHeight();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddOfferComponent, { 
        width: '1000px',
        height: '85vh',
        panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) this.getAllOffers();
    });
  }

  // --- VIEW DIALOG ---
  openViewDialog(offer: OfferDto) {
    this.dialog.open(ViewOfferComponent, {
        width: '850px',
        data: offer, 
        panelClass: 'custom-dialog-container',
        autoFocus: false
    });
  }

  resetParameters() {
      this.agPersist.resetGridSettings();
      window.location.reload();
  }

  convertToAgreement(offer: OfferDto) {
      this.toastr.info("Bu özellik eklenecek: " + offer.offerTitle);
  }
}