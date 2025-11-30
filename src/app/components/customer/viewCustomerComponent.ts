import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../../models/customers/cusotmers';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';

@Component({
  selector: 'view-customer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="profile-container">
      
      <!-- 1. HEADER SECTION: Identity & Status -->
      <div class="profile-header">
        <button class="btn-close-absolute" mat-dialog-close>
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="identity-wrapper">
          <!-- Auto-generated Avatar based on company name -->
          <div class="avatar-circle">
            {{ getInitials(data.companyName) }}
          </div>
          
          <div class="identity-text">
            <div class="d-flex align-items-center gap-2">
              <h2 class="company-name">{{ data.companyName }}</h2>
              <span class="status-badge" [ngClass]="getStatusClass(data.status)">
                {{ data.status || 'Active' }}
              </span>
            </div>
            <div class="contact-person">
              <i class="fa-solid fa-user-tie me-1"></i> {{ data.name }}
            </div>
            <div class="customer-field" *ngIf="data.customerField">
              {{ data.customerField }}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. BODY SECTION: Detailed Info -->
      <div class="profile-body custom-scroll">
        
        <!-- Section: Last Action Banner -->
        <div class="action-banner" *ngIf="data.lastAction">
          <div class="action-icon">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div class="action-details">
            <span class="label">Son Hareket</span>
            <span class="value">{{ data.lastAction }}</span>
            <span class="date">{{ data.lastActionDate | date:'medium' }}</span>
          </div>
        </div>

        <div class="details-grid">
          
          <!-- Column 1: Contact Info -->
          <div class="detail-column">
            <h6 class="section-title">İletişim Bilgileri</h6>
            
            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-envelope"></i></div>
              <div class="data">
                <label>E-Posta</label>
                <a [href]="'mailto:' + data.email" class="value link">{{ data.email || '-' }}</a>
              </div>
            </div>

            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-phone"></i></div>
              <div class="data">
                <label>Telefon</label>
                <a [href]="'tel:' + data.phoneNumber" class="value link">{{ data.phoneNumber || '-' }}</a>
              </div>
            </div>

            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-location-dot"></i></div>
              <div class="data">
                <label>Adres</label>
                <span class="value">{{ data.address || '-' }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-map"></i></div>
              <div class="data">
                <label>Konum</label>
                <span class="value">
                  {{ data.city }}{{ data.city && data.country ? ', ' : '' }}{{ data.country }}
                </span>
              </div>
            </div>
          </div>

          <!-- Column 2: Business & System Info -->
          <div class="detail-column">
            <h6 class="section-title">Kurumsal & Sistem</h6>
            
            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-hashtag"></i></div>
              <div class="data">
                <label>Vergi No / T.C.</label>
                <span class="value font-monospace">{{ data.taxId || '-' }}</span>
              </div>
            </div>

            <div class="info-row">
              <div class="icon"><i class="fa-solid fa-fingerprint"></i></div>
              <div class="data">
                <label>Müşteri ID</label>
                <span class="value small text-muted">{{ data.id }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="info-row sm">
              <div class="data">
                <label>Oluşturulma</label>
                <span class="value">{{ data.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>

            <div class="info-row sm">
              <div class="data">
                <label>Son Güncelleme</label>
                <span class="value">{{ data.updatedAt | date:'mediumDate' }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 3. FOOTER -->
      <div class="profile-footer">
        <button mat-button (click)="dialogRef.close()" class="button-4">
            {{  'Kapat' }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
      background: #fff;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      min-width: 550px; /* Ensure logical width */
    }

    /* --- HEADER --- */
    .profile-header {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 30px 30px 20px 30px;
      position: relative;
      border-bottom: 1px solid #dee2e6;
    }

    .btn-close-absolute {
      position: absolute;
      top: 15px;
      right: 15px;
      background: transparent;
      border: none;
      font-size: 1.2rem;
      color: #adb5bd;
      cursor: pointer;
      transition: color 0.2s;
    }
    .btn-close-absolute:hover { color: #495057; }

    .identity-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar-circle {
      width: 72px;
      height: 72px;
      background: #4f46e5; /* Indigo */
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .identity-text {
      flex: 1;
    }

    .company-name {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }

    .contact-person {
      color: #6b7280;
      font-weight: 500;
      margin-top: 4px;
      font-size: 0.95rem;
    }

    .customer-field {
      display: inline-block;
      margin-top: 6px;
      font-size: 0.75rem;
      background: #e0e7ff;
      color: #4338ca;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Status Badge */
    .status-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-active { background: #dcfce7; color: #166534; }
    .status-passive { background: #f3f4f6; color: #4b5563; }
    .status-pending { background: #fef3c7; color: #92400e; }

    /* --- BODY --- */
    .profile-body {
      padding: 25px 30px;
      overflow-y: auto;
    }

    /* Action Banner */
    .action-banner {
      display: flex;
      align-items: center;
      background: #f0fdf4; /* Light Green bg */
      border: 1px solid #bbf7d0;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .action-icon {
      width: 36px;
      height: 36px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #16a34a;
      margin-right: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .action-details {
      display: flex;
      flex-direction: column;
    }
    
    .action-details .label { font-size: 0.7rem; color: #166534; text-transform: uppercase; font-weight: 700; }
    .action-details .value { font-weight: 600; color: #14532d; }
    .action-details .date { font-size: 0.8rem; color: #16a34a; }

    /* Grid Layout */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    @media(max-width: 700px) {
      .details-grid { grid-template-columns: 1fr; gap: 20px; }
    }

    .section-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
      font-weight: 700;
      margin-bottom: 16px;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 8px;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    
    .info-row.sm { margin-bottom: 12px; }

    .icon {
      width: 24px;
      color: #d1d5db;
      font-size: 1rem;
      margin-top: 2px;
    }

    .data {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .data label {
      font-size: 0.75rem;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .data .value {
      font-size: 0.95rem;
      color: #1f2937;
      font-weight: 500;
    }

    .value.link {
      color: #4f46e5;
      text-decoration: none;
    }
    .value.link:hover { text-decoration: underline; }

    .divider { height: 1px; background: #f3f4f6; margin: 10px 0 15px 0; }
    .font-monospace { font-family: monospace; letter-spacing: -0.5px; background: #f3f4f6; padding: 0 4px; border-radius: 4px; }

    /* --- FOOTER --- */
    .profile-footer {
      padding: 15px 30px;
      background: #fff;
      border-top: 1px solid #f3f4f6;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class ViewCustomerComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    public dialogRef: MatDialogRef<ViewCustomerComponent>
  ) {}

  // Helper to get initials (e.g., "Tech Corp" -> "TC")
  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Helper for status styling
  getStatusClass(status: string): string {
    if (!status) return 'status-passive';
    const s = status.toLowerCase();
    if (s.includes('active') || s.includes('aktif')) return 'status-active';
    if (s.includes('pending') || s.includes('bekle')) return 'status-pending';
    return 'status-passive';
  }
}