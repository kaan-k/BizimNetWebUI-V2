import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import Swal from 'sweetalert2'; 

// Services
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { AggrementComponentService } from '../../../services/component/aggrement-component.service';

// Models
import { OfferDto } from '../../../models/offers/offer'; 

// Components
import { ViewOfferComponent } from '../../offers/view-offer/view-offer.component';

@Component({
  selector: 'app-add-agreement-from-offer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AgGridAngular],
  templateUrl: './add-agreement-from-offer-dialog.component.html',
  styleUrl: './add-agreement-from-offer-dialog.component.css'
})
export class AddAgreementFromOfferDialogComponent implements OnInit {

  rowData: OfferDto[] = [];
  isLoading = true;
  private gridApi!: GridApi<OfferDto>;

  // Grid Definitions
  public defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };
  
  public columnDefs: ColDef[] = [
    { 
      headerName: 'MÜŞTERİ', 
      field: 'customerId', 
      flex: 1,
      cellStyle: { fontWeight: '500', color: '#64748b' }
    },
    { 
      headerName: 'TEKLİF BAŞLIĞI', 
      field: 'offerTitle', 
      flex: 2,
      cellStyle: { fontWeight: '600', color: '#1e293b' }
    },
    { 
      headerName: 'TUTAR', 
      field: 'totalAmount', 
      flex: 1, 
      valueFormatter: params => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value),
      cellStyle: { fontWeight: 'bold', color: '#26a69a' } 
    },
    { 
      headerName: 'TARİH', 
      field: 'createdAt', 
      width: 120,
      valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'
    },
    {
      headerName: 'İŞLEMLER',
      width: 140, // Increased width for 2 buttons
      pinned: 'right',
      cellRenderer: (params: any) => {
        return `
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn-view-action" title="Detayları Gör">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-select-action" title="Sözleşmeye Dönüştür">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </div>
        `;
      },
      cellClass: 'd-flex align-items-center justify-content-center'
    }
  ];

  constructor(
    private offerService: OfferComponentService,
    private agreementService: AggrementComponentService,
    public dialogRef: MatDialogRef<AddAgreementFromOfferDialogComponent>,
    private dialog: MatDialog // Injected MatDialog for opening sub-dialogs
  ) {}

  ngOnInit(): void {
    this.loadApprovedOffers();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
    params.api.addEventListener('cellClicked', (event: CellClickedEvent) => {
      const target = event.event?.target as HTMLElement;
      
      // 1. SELECT ACTION
      if (target.closest('.btn-select-action')) {
        this.createAgreement((event.data as any).id);
      }
      // 2. VIEW ACTION
      else if (target.closest('.btn-view-action')) {
        this.openViewDialog(event.data);
      }
    });
  }

  async loadApprovedOffers() {
    this.isLoading = true;
    try {
      const approvedOffers = await this.offerService.getAllByStatus("Approved");
      this.rowData = approvedOffers;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async createAgreement(offerId: string) {
    const result = await Swal.fire({
      title: 'Teklifi Dönüştür',
      text: "Bu teklifi sözleşmeye dönüştürmek istediğinize emin misiniz?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, Dönüştür',
      cancelButtonText: 'Vazgeç'
    });

    if (result.isConfirmed) {
      await this.agreementService.createFromOffer(offerId, () => {
        this.dialogRef.close(true);
      });
    }
  }

  openViewDialog(offerData: any) {
    this.dialog.open(ViewOfferComponent, {
      width: '850px',
      data: offerData, // Pass the full object
      panelClass: 'custom-dialog-container',
      autoFocus: false
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}