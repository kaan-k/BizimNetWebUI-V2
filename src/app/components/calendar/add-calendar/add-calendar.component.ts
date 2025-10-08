import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import {
  CalendarView,
  CalendarEvent,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
  CalendarCommonModule,
  DateAdapter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { addHours, endOfDay, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { MonthViewDay } from 'calendar-utils';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { ILanguage } from '../../../../assets/locales/ILanguage';
import { Languages } from '../../../../assets/locales/language';
import { Duty } from '../../../models/duties/duty';

import { DutyComponentService } from '../../../services/component/duty-component.service';
import { AddDutyDialogComponent } from './add-duty-dialog.component';
import { AddDutyQuickDialogComponent } from './add-duty-quick-dialog.component';

type DutyEvent = CalendarEvent<{ duty: Duty }>;
registerLocaleData(localeTr);
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
  ],
   providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    { provide: LOCALE_ID, useValue: 'tr-TR' },   // 👈 Turkish locale
  ],
})
export class AddCalendarComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
    locale = 'tr';                                  // angular-calendar locale
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen = false;


  events: DutyEvent[] = [];


  showModal = false;
  modalData?: { action: string; event: DutyEvent };

  constructor(
    private dutySvc: DutyComponentService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  async ngOnInit() {
    await this.loadDuties();
  }


  private async loadDuties() {
    const duties: Duty[] = await this.dutySvc.getAllDuty();
    this.events = duties.map(d => this.toEvent(d));
    this.refresh.next();
  }

  private toEvent(d: Duty): DutyEvent {
    const start = d.deadline ? new Date(d.deadline) : (d.createdAt ? new Date(d.createdAt) : startOfDay(new Date()));
    const safeStart = startOfDay(start);
    const safeEnd = endOfDay(start);

    return {
      title: d.customerId + d.name,
      start: safeStart,
      end: safeEnd,
      allDay: true,
      draggable: true,
      resizable: { beforeStart: true, afterEnd: true },
      color: this.pickColor(d),
      meta: { duty: d },
    };
  }

  private pickColor(d: Duty): { primary: string; secondary: string } {
    if (d.status && d.status.toLowerCase().includes('tamam')) {
      return { primary: '#198754', secondary: '#d4edda' }; // completed = green
    }
    switch ((d.priortiy ?? '').toLowerCase()) {
      case 'acil':
      case 'yüksek':
        return { primary: '#dc3545', secondary: '#f8d7da' }; // high = red
      case 'orta':
        return { primary: '#0d6efd', secondary: '#d1e8ff' }; // medium = blue
      default:
        return { primary: '#e3bc08', secondary: '#fdf1ba' }; // low/unspecified = yellow
    }
  }

  setView(view: CalendarView) { this.view = view; }
  closeOpenMonthViewDay() { this.activeDayIsOpen = false; }

  dayClicked(ev: { day: MonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }) {
    const date = ev.day.date as Date;
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(isSameDay(this.viewDate, date) && this.activeDayIsOpen) && (ev.day.events?.length ?? 0) > 0;
      this.viewDate = date;
    }

  }

  eventTimesChanged({ event, newStart, newEnd }: { event: DutyEvent; newStart: Date; newEnd?: Date }) {
    this.events = this.events.map(e => e === event ? { ...event, start: newStart, end: newEnd ?? addHours(newStart, 8) } : e);
    this.modalData = { action: 'Zamanı değişti', event };
    this.showModal = true;
    this.refresh.next();
  }

  closeInfoModal() { this.showModal = false; }

  openAddDutyDialog(preset?: Date) {
    const presetDate = preset ? preset.toISOString().substring(0,10) : '';
    const ref = this.dialog.open(AddDutyDialogComponent, {
      width: '700px',
      data: { presetDate }
    });
  

    
    
    ref.afterClosed().subscribe(async (result) => {
      if (!result) return;

      try {
        await new Promise<void>((resolve) => this.dutySvc.addDuty(result, () => resolve())); // same callback pattern you use
        this.toast.success(this.lang.addNewDuty);

        this.events = [...this.events, this.toEvent({ ...result } as Duty)];
        this.refresh.next();



      } catch {
        this.toast.error(this.lang.error);
      }
    });
  }

  
    openAddQuickDutyDialog(preset?: Date) {
  const presetDate = preset ? preset.toISOString().substring(0,10) : '';
  const ref = this.dialog.open(AddDutyQuickDialogComponent, {
    width: '700px',
    data: { presetDate }
  });

  ref.afterClosed().subscribe(async (result) => {
    if (!result) return;

    try {
        await new Promise<void>((resolve) => this.dutySvc.addDutyCompleted(result, () => resolve())); // same callback pattern you use
        this.toast.success(this.lang.addNewDuty);

        this.events = [...this.events, this.toEvent({ ...result } as Duty)];
        this.refresh.next();



      } catch {
        this.toast.error(this.lang.error);
      }
    });

    
  }
}
