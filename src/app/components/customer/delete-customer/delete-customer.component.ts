import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'customer-delete-template',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './delete-customer.component.html',
  styleUrl: './delete-customer.component.css'

})
export class CustomerDeleteTemplate {
  constructor(public dialogRef: MatDialogRef<CustomerDeleteTemplate>) {}
}