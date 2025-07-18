import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InstallationRequest } from '../../models/installationRequest/installationRequest';
import { CalendarEvent, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; 
import { InstallationRequestComponentService } from '../../services/component/installation-request-component.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarModule,],
   providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    }
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[];

  constructor(private installationRequestComponentService:InstallationRequestComponentService){}
  installationRequests: InstallationRequest[];

  ngOnInit(): void { 
    this.calendar();
  }
  async calendar(){
    debugger;
  this.installationRequests = await this.installationRequestComponentService.getAllInstallationRequest();
  this.events = this.installationRequests.map((req): CalendarEvent => ({
      start: new Date(req.date),
      title: req.installationNote ?? 'Kurulum',
      color: req.isCompleted ? { primary: '#1e90ff', secondary: '#D1E8FF' } : { primary: '#ad2121', secondary: '#FAE3E3' },
      meta: req
    }));
  } 
}
