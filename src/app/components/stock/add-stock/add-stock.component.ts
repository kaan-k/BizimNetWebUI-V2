import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { StockComponentService } from '../../../services/component/stock-component.service';
// Ensure this path matches your file structure
import { StockAddDto } from '../../../models/stock/stockAddDto'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent implements OnInit {

  stockForm: FormGroup;

  // Enum Mapping
  deviceTypes = [
    { id: 0, name: 'Printer' },
    { id: 1, name: 'Server' },
    { id: 2, name: 'Client' },
    { id: 3, name: 'Software' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private stockService: StockComponentService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddStockComponent>
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.stockForm = this.formBuilder.group({
      name: ['', Validators.required],
      // Matches backend DTO property 'count'
      count: [1, [Validators.required, Validators.min(1)]], 
      deviceType: [null, Validators.required],
      // input[type='date'] returns a string "YYYY-MM-DD"
      purchaseDate: [this.formatDate(new Date()), Validators.required], 
      serialNumber: [''],
      description: ['']
    });
  }

  save() {
    if (this.stockForm.valid) {
      const formValues = this.stockForm.value;

      // Map to StockAddDto
      const stockModel: StockAddDto = {
        name: formValues.name,
        // Convert string to number for backend
        count: Number(formValues.count), 
        deviceType: Number(formValues.deviceType),
        // Add isActive (required by your interface)
        isActive: true, 
        // Optional fields (if they exist in your DTO extension or backend handles them separately)
        // Note: Your provided interface only showed 4 fields. 
        // If backend accepts dates/serial, ensure DTO has them.
        // Assuming backend maps these extra fields or ignores them:
        // purchaseDate: new Date(formValues.purchaseDate),
        // serialNumber: formValues.serialNumber,
        // description: formValues.description
      };

      this.stockService.add(stockModel, () => {
        this.dialogRef.close(true);
      });
    } else {
      this.toastr.warning('Lütfen zorunlu alanları doldurunuz.', 'Eksik Bilgi');
      this.stockForm.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}