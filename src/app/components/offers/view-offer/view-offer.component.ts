import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

// Services
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';

// Models
import { OfferDto } from '../../../models/offers/offer';

@Component({
  selector: 'app-view-offer',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './view-offer.component.html',
  styleUrl: './view-offer.component.css'
})
export class ViewOfferComponent implements OnInit {

  offer: OfferDto | null = null;
  customerName: string = '';
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<ViewOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Can be ID or Object
    private offerService: OfferComponentService, // Ensure you have getById here
    private customerService: CustomerComponentService
  ) {}

  ngOnInit(): void {
    this.loadOfferDetails();
  }

  async loadOfferDetails() {
    this.isLoading = true;
    try {
      // 1. Determine if data is ID or Object
      let offerId = typeof this.data === 'string' ? this.data : this.data.id;

      // 2. Fetch Full Details (assuming service has getById)
      // If your grid passes the full object with items, you can skip this.
      // But usually grid has summary, so we fetch details.
      // For now, I'll assume we might need to fetch or use passed data.
      
      if (typeof this.data === 'object' && this.data.items) {
         this.offer = this.data; // Use passed data if it has items
      } else {
         // Fetch from backend (You need to implement getById in OfferService if not exists)
         // this.offer = await this.offerService.getById(offerId); 
         // Fallback for now if you haven't built getById yet:
         this.offer = this.data; 
      }

      // 3. Fetch Customer Name
      if (this.offer && this.offer.customerId) {
        try {
            const customer = await this.customerService.getById(this.offer.customerId);
            this.customerName = customer.name || customer.companyName;
        } catch {
            this.customerName = 'Bilinmiyor';
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  close() {
    this.dialogRef.close();
  }
}