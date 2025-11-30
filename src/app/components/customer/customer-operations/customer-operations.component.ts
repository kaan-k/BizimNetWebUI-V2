import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

// Services
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { AggrementComponentService } from '../../../services/component/aggrement-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';

// Models
import { OfferDto } from '../../../models/offers/offer';
import { Aggrement } from '../../../models/aggrements/aggrement';
import { Customer } from '../../../models/customers/cusotmers';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { AgreementDetailDialogComponent } from '../../agreements/aggrement-detail-dialog/aggrement-detail-dialog.component';
import { ViewOfferComponent } from '../../offers/view-offer/view-offer.component';

@Component({
  selector: 'app-customer-operations',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTabsModule, MatButtonModule],
  templateUrl: './customer-operations.component.html',
  styleUrls: ['./customer-operations.component.css']
})
export class CustomerOperationsComponent implements OnInit {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  
  // Data States
  offers: OfferDto[] = [];
  agreements: Aggrement[] = [];
  branches: Customer[] = []; 
  
  isLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CustomerOperationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private offerService: OfferComponentService,
    private agreementService: AggrementComponentService,
    private customerService: CustomerComponentService ,
        private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData() {
    this.isLoading = true;
    
    try {

      const [allOffers, allAgreements, myBranches] = await Promise.all([
        this.offerService.getAllOffer(),
        this.agreementService.getAllAggrement(),
        this.customerService.getBranchByHqId(this.data.id) as unknown as Promise<Customer[]>
      ]);


      this.offers = allOffers.filter(o => 
          o.customerId === this.data.id || o.customerId === this.data.companyName
      );

      this.agreements = allAgreements.filter(a => 
          a.customerId === this.data.id || a.customerId === this.data.companyName
      );
      this.branches = myBranches || [];

    } catch (error) {
      console.error('Error fetching customer operations:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-neutral';
    switch(status.toLowerCase()) {
      case 'active': case 'accepted': case 'onaylandı': return 'status-success';
      case 'pending': case 'bekliyor': return 'status-warning';
      case 'rejected': case 'passive': case 'reddedildi': return 'status-danger';
      default: return 'status-neutral';
    }
  }

  viewOffer(offer: OfferDto) { 
 this.dialog.open(ViewOfferComponent, {
          width: '850px',
          data: offer, 
          panelClass: 'custom-dialog-container',
          autoFocus: false
      });
  }

  viewAgreement(agreement: Aggrement) { 
    this.openDetailDialog(agreement.id);
  }

  viewBranch(branch: Customer) {
    console.log("View Branch", branch);
  }

  openAddBranchDialog() {
     const dialogData = { 
         parentId: this.data.id, 
         parentName: this.data.companyName 
     };


     console.log("Open Add Branch Dialog with data:", dialogData);
  }





  openDetailDialog(id: string) {
      this.dialog.open(AgreementDetailDialogComponent, {
        width: '950px', 
        data: id, 
        autoFocus: false,
        panelClass: 'custom-dialog-panel' 
      });
    }
}