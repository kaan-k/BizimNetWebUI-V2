import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Models
import { Customer } from '../../../models/customers/cusotmers';
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';

// Import your "Add" Dialogs
import { AddOfferComponent } from '../../offers/add-offer/add-offer.component'; 
import { AddAgreementComponent } from '../../agreements/add-agreement/add-agreement.component'; 
import { AddCustomerComponent } from '../add-customer/add-customer.component'; // For Branch

@Component({
  selector: 'app-customer-actions',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './customer-actions.component.html',
  styleUrls: ['./customer-actions.component.css']
})
export class CustomerActionsComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(
    public dialogRef: MatDialogRef<CustomerActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer, // The Current Customer
    private dialog: MatDialog
  ) {}

  // 1. Open Add Offer Dialog
  openNewOffer() {
    this.dialog.open(AddOfferComponent, {
      width: '1000px',
      height: '85vh',
      panelClass: 'custom-dialog-container',
      // Pass the customer info so the Offer Form can pre-select it
      data: { 
        preSelectedCustomerId: this.data.id,
        preSelectedCustomerName: this.data.companyName 
      }
    }).afterClosed().subscribe(result => {
        if(result) this.dialogRef.close(true); // Close actions menu if success
    });
  }

  // 2. Open Add Agreement Dialog
  openNewAgreement() {
    this.dialog.open(AddAgreementComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: { 
        preSelectedCustomerId: this.data.id,
        preSelectedCustomerName: this.data.companyName 
      }
    }).afterClosed().subscribe(result => {
        if(result) this.dialogRef.close(true);
    });
  }

  // 3. Add Branch (Reusable logic)
  openAddBranch() {
    this.dialog.open(AddCustomerComponent, {
      width: '700px',
      panelClass: 'custom-dialog-container',
      data: { 
        parentId: this.data.id, 
        parentName: this.data.companyName 
      }
    }).afterClosed().subscribe(result => {
        if(result) this.dialogRef.close(true);
    });
  }
}