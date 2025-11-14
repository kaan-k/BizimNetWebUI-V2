import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Use the full calendar+add feature
import { AddCalendarComponent } from '../calendar/add-calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AddCalendarComponent,  // ⟵ embed the combined calendar here
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Keep any dashboard-specific logic here.
  // The calendar’s own logic stays encapsulated inside AddCalendarComponent.
}
