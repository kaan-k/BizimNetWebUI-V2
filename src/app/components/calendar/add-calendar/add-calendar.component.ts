import { ChangeDetectionStrategy, Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { Subject } from 'rxjs';

// UI & Animations
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
// Calendar Imports
import {
  CalendarView,
  CalendarEvent,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
  CalendarCommonModule,
  CalendarDateFormatter
} from 'angular-calendar';
import { addHours, isSameDay, isSameMonth } from 'date-fns';
import { MonthViewDay } from 'calendar-utils';

// Internal Services & Components
import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Duty } from '../../../models/duties/duty';
import { DutyComponentService } from '../../../services/component/duty-component.service';
import { EmployeeService } from '../../../services/common/employee.service';
import { UserComponentService } from '../../../services/component/user/user-component.service';
import { CustomDateFormatter } from '../../../core/datetime/datetime-picker-component';

// Dialogs
import { AddDutyDialogComponent } from './add-duty-dialog/add-duty-dialog.component';
import { AddDutyQuickDialogComponent } from './add-duty-quick-dialog/add-duty-quick-dialog.component';
import { AddServiceDutyDialogComponent } from './add-service-duty-dialog/add-service-duty-dialog.component';
import { AddCalendarViewDutyComponent } from './add-calendar-duty-details-dailog/add-calendar-duty-details-dailog.component';

// Register Locale
registerLocaleData(localeTr);

type DutyEvent = CalendarEvent<{ duty: Duty }>;

@Component({
  selector: 'add-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    FontAwesomeModule,
    MatMenuModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'tr-TR' },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter }
  ],
})
export class AddCalendarComponent implements OnInit {
  // Configuration
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng')) || Languages.lngs.get('tr');
  locale = 'tr';
  
  // State
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate = new Date();
  activeDayIsOpen = false;
  refresh = new Subject<void>();
  
  // Data
  selectedId: string | null = null;
  employees: any[] = []; 
  events: DutyEvent[] = [];

  // Modal State
  showModal = false;
  modalData?: { action: string; event: DutyEvent };

  constructor(
    private userComponentservice: UserComponentService,
    private dutySvc: DutyComponentService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  async ngOnInit() {
    await this.getAllUser();
    await this.loadDuties();
  }

  // #region Data Loading
  async getAllUser() {
    this.employees = await this.userComponentservice.getAllUser();
  }

  async loadDuties() {
    this.selectedId = '';
    const duties: Duty[] = await this.dutySvc.getAllDuty();
    this.updateEvents(duties);
  }

  async loadDutyForEmployee(employeeId: string) {
    this.selectedId = employeeId;
    const duties: Duty[] = await this.dutySvc.getAllByEmployeeId(employeeId);
    this.updateEvents(duties);
  }

  async loadDutyByStatus(status: string, id: string) {
    this.selectedId = id;
    const duties: Duty[] = await this.dutySvc.getAllByStatus(status);
    this.updateEvents(duties);
  }

  private updateEvents(duties: Duty[]) {
    this.events = duties.map((d) => this.toEvent(d));
    this.refresh.next();
  }
  // #endregion

  // #region Event Mapping & Logic
  private toEvent(d: Duty): DutyEvent {
    // Handle null dates defaults
    if (!d.beginsAt) {
      d.beginsAt = d.createdAt || new Date();
      d.endsAt = d.deadline || addHours(d.beginsAt, 1);
    }

    const finalStart = this.convertToIsoDate(d.beginsAt);
    const finalEnd = this.convertToIsoDate(d.endsAt);

    return {
      id: d.id,
      title: `${d.customerId ?? ''} ${d.name ?? ''}`.trim(),
      start: finalStart,
      end: finalEnd,
      allDay: false,
      draggable: false, 
      resizable: { beforeStart: false, afterEnd: false },
      color: this.pickColor(d),
      meta: { duty: d },
    };
  }

  eventToDuty(event: CalendarEvent<{ duty: Duty }>): Duty {
    if (event.meta?.duty) {
      return event.meta.duty;
    }

    const [customerId, ...nameParts] = (event.title ?? '').split(' ');
    const name = nameParts.join(' ').trim();
    const now = new Date();

    return {
      id: event.id?.toString() ?? '',
      name: name || '',
      description: '',
      customerId: customerId || '',
      priority: 'Orta',
      status: 'Açık',
      lastUpdated: now,
      deadline: now,
      createdAt: now,
      beginsAt: event.start,
      endsAt: event.end ?? event.start,
      completedAt: null,
      createdBy: '',
      completedBy: null,
      assignedEmployeeId: '',
      assignedToName: '',
      startUtc: event.start.toISOString(),
      endUtc: (event.end ?? event.start).toISOString(),
    } as Duty;
  }

  convertToIsoDate(date: Date | string | null): Date {
    if (!date) return new Date();
    return typeof date === 'string' ? new Date(date) : date;
  }

  private pickColor(d: Duty): { primary: string; secondary: string } {
    if (d.status && d.status.toLowerCase().includes('tamamlandı')) {
      return { primary: '#198754', secondary: '#d4edda' }; // Green
    }
    else{
              return { primary: '#dc3545', secondary: '#f8d7da' }; // Red

    }
    switch ((d.priority ?? '').toLowerCase()) {
      case 'acil':
      case 'yüksek':
        return { primary: '#dc3545', secondary: '#f8d7da' }; // Red
      case 'orta':
        return { primary: '#0d6efd', secondary: '#d1e8ff' }; // Blue
      default:
        return { primary: '#e3bc08', secondary: '#fdf1ba' }; // Yellow
    }
  }
  // #endregion

  // #region View & Interactions
  setView(view: CalendarView) {
    this.view = view;
  }

  // FIXED: Added missing method
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked(ev: { day: MonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }) {
    const date = ev.day.date;
    if (isSameMonth(date, this.viewDate)) {
      if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked(action: { event: CalendarEvent; sourceEvent: MouseEvent | KeyboardEvent }) {
    this.openDialog(this.eventToDuty(action.event as DutyEvent));
  }

  eventTimesChanged({ event, newStart, newEnd }: { event: DutyEvent; newStart: Date; newEnd?: Date }) {
    this.events = this.events.map((e) => {
      if (e === event) {
        return { ...event, start: newStart, end: newEnd ?? addHours(newStart, 1) };
      }
      return e;
    });
    this.modalData = { action: 'Zamanı değişti', event };
    this.showModal = true;
    this.refresh.next();
  }
  // #endregion

  // #region Dialogs
  openDialog(duty: Duty) {
    this.dialog.open(AddCalendarViewDutyComponent, {
      width: '900px',
      data: duty,
      panelClass: 'matdialog-view'
    });
  }

  closeInfoModal() {
    this.showModal = false;
  }

 openAddDutyDialog(preset?: Date) {
    // 1. Prepare the preset date if clicked from calendar
    const presetDate = preset ? preset.toISOString().substring(0, 10) : '';

    // 2. Open the Dialog
    const ref = this.dialog.open(AddDutyDialogComponent, {
      width: '100%', 
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '95vh',
      panelClass: 'responsive-dialog',
      data: { presetDate }, // <--- YOU MISSED PASSING THIS DATA
    });

    // 3. LISTEN FOR THE RESULT (This was missing!)
    ref.afterClosed().subscribe(async (result) => {
      // If result is null (user clicked cancel/X), stop here.
      if (!result) return; 

      try {
        // Send to Backend
        await new Promise<void>((resolve) =>
          this.dutySvc.addDuty(result, () => resolve())
        );
        
        // Success Message
        this.toast.success(this.lang.addNewDuty);
        

        await this.loadDuties();
        

      } catch (err) {
        console.error(err);
        this.toast.error(this.lang.error);
      }
    });
  }

  openAddQuickDutyDialog(preset?: Date) {
    this.handleDialog(AddDutyQuickDialogComponent, preset, '70rem', '30rem', true);
  }

  openAddServiceDutyDialog(preset?: Date) {
    this.handleDialog(AddServiceDutyDialogComponent, preset, '70rem', '30rem', true);
  }

  private handleDialog(component: any, preset: Date | undefined, width: string, height?: string, isCompletedFlow = false) {
    const presetDate = preset ? preset.toISOString().substring(0, 10) : '';
    const ref = this.dialog.open(component, {
      width,
      height,
      data: { presetDate },
    });

    ref.afterClosed().subscribe(async (result) => {
      if (!result) return;
      try {
        await new Promise<void>((resolve) => {
          if (isCompletedFlow) {
            this.dutySvc.addDutyCompleted(result, () => resolve());
          } else {
            this.dutySvc.addDuty(result, () => resolve());
          }
        });
        this.toast.success(this.lang.addNewDuty);
        this.events = [...this.events, this.toEvent(result as Duty)];
        this.refresh.next();
      } catch (err) {
        console.error(err);
        this.toast.error(this.lang.error);
      }
    });
  }
  // #endregion
}