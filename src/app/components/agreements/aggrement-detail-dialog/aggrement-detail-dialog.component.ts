import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2'; // <--- IMPORT SWEETALERT2

// Services
import { AggrementComponentService } from '../../../services/component/aggrement-component.service';
import { BillingComponentService } from '../../../services/component/billing-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';

// Models
import { Aggrement } from '../../../models/aggrements/aggrement';
import { BillingDto } from '../../../models/billings/billingDto';

@Component({
  selector: 'app-agreement-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './aggrement-detail-dialog.component.html',
  styleUrl: './aggrement-detail-dialog.component.css'
})
export class AgreementDetailDialogComponent implements OnInit {

  agreementDetails: Aggrement | null = null;
  bills: any[] = [];
  customerName: string = '';
  isLoading = true;
  isProcessing = false; 

  paymentAmount: number | null = null;
  paymentMethod: string = 'Nakit'; 
  methods: string[] = ['Nakit', 'Kredi Kartı', 'Havale/EFT', 'Çek'];

  constructor(
    public dialogRef: MatDialogRef<AgreementDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public agreementId: string,
    private agreementService: AggrementComponentService,
    private billingService: BillingComponentService,
    private customerService: CustomerComponentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get remainingAmount(): number {
    if (!this.agreementDetails) return 0;
    return this.agreementDetails.agreedAmount - this.agreementDetails.paidAmount;
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.agreementDetails = await this.agreementService.getById(this.agreementId);
      
      if(this.agreementDetails && this.agreementDetails.billings && this.agreementDetails.billings.length > 0) {
          const billRequests = this.agreementDetails.billings.map(id => this.billingService.getById(id));
          const billObjects = await Promise.all(billRequests);
          this.bills = billObjects.reverse(); 
      } else {
          this.bills = [];
      }

      if (this.agreementDetails && this.agreementDetails.customerId) {
          try {
              const customer = await this.customerService.getById(this.agreementDetails.customerId);
              this.customerName = customer.name; // or companyName
          } catch {
              this.customerName = this.agreementDetails.customerId;
          }
      }

    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  fillRemainingAmount() {
    if(this.remainingAmount > 0) {
      this.paymentAmount = this.remainingAmount;
    }
  }

  // --- PAYMENT PROCESS WITH PRETTY PROMPT ---
  async submitPayment() {
    if (!this.paymentAmount || this.paymentAmount <= 0) return;
    if (!this.agreementDetails) return;

    let title = 'Tahsilat Onayı';
    let text = `<b>${this.paymentAmount} ₺</b> tutarında tahsilat kaydı oluşturulacak.`;
    let icon: 'question' | 'warning' = 'question';
    let confirmColor = '#26a69a'; // Your Theme Teal

    // Overpayment Warning Logic
    if (this.paymentAmount > this.remainingAmount) {
        title = 'Dikkat: Fazla Ödeme!';
        text = `Girdiğiniz tutar (<b>${this.paymentAmount} ₺</b>), kalan borçtan fazladır.<br>Devam etmek istiyor musunuz?`;
        icon = 'warning';
        confirmColor = '#f59e0b'; // Amber/Orange for warning
    }

    // SweetAlert2 Prompt
    const result = await Swal.fire({
        title: title,
        html: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Evet, Tahsil Et',
        cancelButtonText: 'Vazgeç',
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    // Proceed if confirmed
    this.isProcessing = true;

    const newBilling: BillingDto = {
        customerId: this.agreementDetails.customerId, 
        aggreementId: this.agreementId, 
        amount: this.paymentAmount,
        paidAmount: this.paymentAmount, 
        billingDate: new Date(),
        paymentDate: new Date(),
        dueDate: new Date(), 
        billingMethod: this.paymentMethod
    };

    try {
      await this.billingService.add(newBilling, () => {
        // Optional: Success Alert
        Swal.fire({
            icon: 'success',
            title: 'Başarılı',
            text: 'Tahsilat kaydı oluşturuldu.',
            timer: 1500,
            showConfirmButton: false
        });

        this.paymentAmount = null; 
        this.paymentMethod = 'Nakit'; 
        this.loadData(); 
        this.isProcessing = false;
      });
    } catch (error) {
      console.error(error);
      this.isProcessing = false;
    }
  }

  // --- DELETE PROCESS WITH PRETTY PROMPT ---
  async deleteBill(billId: string) {
    
    const result = await Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu tahsilat kaydı silinecek ve bakiye güncellenecektir. Bu işlem geri alınamaz!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Red
        cancelButtonColor: '#64748b', // Gray
        confirmButtonText: 'Evet, Sil',
        cancelButtonText: 'Vazgeç'
    });

    if (!result.isConfirmed) return;

    try {
      this.isLoading = true; 
      await this.billingService.delete(billId, () => {
        // Optional: Small toast or success alert
        Swal.fire({
            icon: 'success',
            title: 'Silindi',
            text: 'Kayıt başarıyla silindi.',
            timer: 1000,
            showConfirmButton: false
        });
        this.loadData(); 
      });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  close() {
    this.dialogRef.close();
  }
}