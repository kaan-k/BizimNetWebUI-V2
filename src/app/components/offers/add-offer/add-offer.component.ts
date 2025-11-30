import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { firstValueFrom } from 'rxjs'; // Imported firstValueFrom

// Services
import { OfferComponentService } from '../../../services/component/offer-component.service';
import { CustomerComponentService } from '../../../services/component/customer-component.service';
import { StockComponentService } from '../../../services/component/stock-component.service';

// Models
import { Customer } from '../../../models/customers/cusotmers';
import { Stock } from '../../../models/stock/stock'; 
import { OfferDto } from '../../../models/offers/offer';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, NgSelectModule],
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent implements OnInit {

  offerForm: FormGroup;
  customers: Customer[] = [];
  stocks: Stock[] = []; 
  isGeneratingPdf: boolean = false; // Loading state for PDF button
  
  get grandTotal(): number {
    const items = this.offerForm.get('items') as FormArray;
    return items.controls
      .map(c => c.get('totalPrice')?.value || 0)
      .reduce((acc, curr) => acc + curr, 0);
  }

  constructor(
    private fb: FormBuilder,
    private offerService: OfferComponentService,
    private customerService: CustomerComponentService,
    private stockService: StockComponentService,
    public dialogRef: MatDialogRef<AddOfferComponent>
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadData();
  }

  createForm() {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      customerId: [null, Validators.required],
      expirationDate: [this.formatDate(new Date()), Validators.required],
      description: [''],
      items: this.fb.array([]) 
    });
    
    this.addItem();
  }

  get itemControls() {
    return (this.offerForm.get('items') as FormArray).controls;
  }

  async loadData() {
    const [customers, stocks] = await Promise.all([
        this.customerService.getAllCustomer(),
        this.stockService.getAll() 
    ]);
    this.customers = customers;
    this.stocks = (stocks as any); 
  }

  addItem() {
    const items = this.offerForm.get('items') as FormArray;
    const itemGroup = this.fb.group({
      stockId: [null, Validators.required],
      stockName: [''], 
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [0] 
    });

    itemGroup.valueChanges.subscribe(val => {
        const total = (val.quantity || 0) * (val.unitPrice || 0);
        if (val.totalPrice !== total) {
            itemGroup.patchValue({ totalPrice: total }, { emitEvent: false });
        }
    });

    items.push(itemGroup);
  }

  removeItem(index: number) {
    const items = this.offerForm.get('items') as FormArray;
    items.removeAt(index);
  }

  onStockSelect(stock: Stock, index: number) {
    const items = this.offerForm.get('items') as FormArray;
    const row = items.at(index);
    if (stock) {
        row.patchValue({
            stockName: stock.name,
            unitPrice: 0 
        });
    }
  }

  // --- HELPER: Prepare DTO ---
  private getOfferDtoFromForm(): OfferDto {
      const formVal = this.offerForm.value;
      const currentUserId = localStorage.getItem("userId"); 

      return {
        offerTitle: formVal.title, 
        customerId: formVal.customerId,
        description: formVal.description,
        expirationDate: new Date(formVal.expirationDate),
        totalAmount: this.grandTotal,
        items: formVal.items.map((i: any) => ({
            stockId: i.stockId,
            stockName: i.stockName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice
        })),
        Status: "Pending", 
        EmployeeId: currentUserId 
      };
  }

  // --- YOUR NEW METHOD ---
   // --- YOUR NEW METHOD (FIXED) ---
  async generateOfferReport(offerDto: OfferDto) {
    // Fix 1: Removed firstValueFrom() because the service already returns a Promise
    const response = await this.offerService.generateOfferReport(offerDto);
    
    // Fix 2: Cast to 'any' to access '.data' because TypeScript infers the wrong type
    return (response as any).data;
  }

  // --- PDF BUTTON ACTION ---
  async downloadPdf() {
    if (this.offerForm.invalid) {
        this.offerForm.markAllAsTouched();
        return;
    }

    this.isGeneratingPdf = true;
    try {
        const dto = this.getOfferDtoFromForm();
        const pdfBase64 = await this.generateOfferReport(dto);
        
        if (pdfBase64) {
            this.savePdfFile(pdfBase64, `Teklif-${dto.offerTitle}.pdf`);
        }
    } catch (error) {
        console.error("PDF oluşturulurken hata:", error);
        // You might want to show a toastr/notification here
    } finally {
        this.isGeneratingPdf = false;
    }
  }

 



  // Helper to convert Base64 to Blob and trigger download
  private savePdfFile(base64Data: string, fileName: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  // --- SAVE ---
  save() {
    if (this.offerForm.valid) {
      const offerDto = this.getOfferDtoFromForm();

      this.offerService.addOffer(offerDto, () => {
        this.dialogRef.close(true);
        
      });
    } else {
        this.offerForm.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}