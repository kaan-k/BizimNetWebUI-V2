import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent, FirstDataRenderedEvent } from 'ag-grid-community';
import { OfferComponentService } from '../../services/component/offer-component.service';
import { OfferDto } from '../../models/offers/offer';
import { AddOfferComponent } from './add-offer/add-offer.component';
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
      // FIX 1: Use valueGetter to handle 'status' (API) vs 'Status' (Model) casing mismatches
      field: 'status', 
      headerName: 'DURUM', 
      width: 120,
      valueGetter: params => params.data.status || params.data.Status,
      cellRenderer: (params: any) => {
        const status = params.value;
        let colorClass = 'badge-secondary';
        let label = status;

        // Robust check for lowercase or PascalCase
        if (status === 'Pending' || status === 'pending') { colorClass = 'badge-warning'; label = 'Bekliyor'; }
        else if (status === 'Approved' || status === 'Approved' || status === 'approved') { colorClass = 'badge-success'; label = 'Onaylandı'; }
        else if (status === 'Rejected' || status === 'rejected') { colorClass = 'badge-danger'; label = 'Reddedildi'; }

        return `<span class="badge ${colorClass}">${label}</span>`;
      }
    },
    { 
      field: 'expirationDate', 
      headerName: 'GEÇERLİLİK', 
      width: 120,
      valueFormatter: params => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    {
      headerName: 'İŞLEMLER',
      field: 'action',
      width: 160, 
      pinned: 'right',
      cellRenderer: (params: any) => {
        // FIX 2: Get status safely from either property
        const status = params.data.status || params.data.Status;
        
        // FIX 3: Robust checks
        const isPending = status === 'Pending' || status === 'pending';
        const isApproved = status === 'Approved' || status === 'Accepted' || status === 'approved' || status === 'accepted';
        
        const showConvert = isApproved && status !== 'Converted';
        
        return `
          <div style="display: flex; gap: 10px; justify-content: center; align-items: center; height: 100%;">
            
            ${isPending ? `<i class="fa-solid fa-check action-btn-approve" title="Onayla" style="cursor:pointer; color: #10b981; font-size: 1.1rem;"></i>` : ''}

            ${showConvert ? `<i class="fa-solid fa-file-contract action-btn-convert" title="Sözleşmeye Dönüştür" style="cursor:pointer; color: #f59e0b; font-size: 1.1rem;"></i>` : ''}
            
            <i class="fa-solid fa-eye action-btn-view" title="Detaylar" style="cursor:pointer; color: #3b82f6; font-size: 1.1rem;"></i>
            
            <i class="fa-solid fa-trash-can action-btn-delete" title="Sil" style="cursor:pointer; color: #ef4444; font-size: 1.1rem;"></i>
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
      
      // 1. Approve
      if (target.classList.contains('action-btn-approve')) {
          this.approveOffer(event.data);
      }
      // 2. Convert
      else if (target.classList.contains('action-btn-convert')) {
          this.convertToAgreement(event.data);
      }
      // 3. View
      else if (target.classList.contains('action-btn-view')) {
          this.openViewDialog(event.data);
      }
      // 4. Delete
      else if (target.classList.contains('action-btn-delete')) {
          // this.deleteOffer(event.data.id);
          this.toastr.warning("Silme işlemi henüz aktif değil.");
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
      this.toastr.info("Bu özellik için Sözleşmeler sayfasındaki 'Tekliften Oluştur' butonunu kullanabilirsiniz.");
  }

  // --- APPROVE LOGIC ---
  async approveOffer(offer: OfferDto) {
      const id = (offer as any).id;
      
      if(confirm(`${offer.offerTitle} başlıklı teklifi onaylamak istiyor musunuz?`)) {
          await this.offerService.approve(id, () => {
              this.toastr.success("Teklif onaylandı.", "Başarılı");
              this.getAllOffers();
          });
      }
  }
}