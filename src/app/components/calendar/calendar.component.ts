import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {  MonthViewDay } from 'calendar-utils';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
  CalendarCommonModule, // gives you calendarDate pipe + nav directives
  DateAdapter,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';

import { FormsModule } from '@angular/forms';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const colors: Record<string, EventColor> = {
  red: { primary: '#ad2121', secondary: '#FAE3E3' },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' },
};

@Component({
  selector: 'calendar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styles: [`
    h3 { margin: 0 0 10px; }
    pre { background-color: #f5f5f5; padding: 15px; }
    /* super-lightweight fake modal */
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; }
    .modal-card { background:#fff; border-radius:8px; width:min(700px, 92vw); max-height: 86vh; overflow:auto; box-shadow:0 10px 30px rgba(0,0,0,.25); }
    .modal-header, .modal-footer { padding:.75rem 1rem; border-bottom:1px solid #eee; }
    .modal-footer { border-top:1px solid #eee; border-bottom:none; }
    .modal-body { padding:1rem; }
    .btn { padding:.375rem .75rem; border:1px solid #ccc; background:#f8f9fa; border-radius:.375rem; cursor:pointer; }
    .btn + .btn { margin-left:.5rem; }
  `],
  imports: [
    CommonModule,
    // ✅ Use NgModule API (works fine in a standalone component’s `imports`)
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    FormsModule,
    JsonPipe,],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
  ],
})
export class CalendarComponent {
  // simple modal state (no ng-bootstrap)
  showModal = false;
  modalData?: { action: string; event: CalendarEvent };

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }) => this.handleEvent('Edited', event),
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }) => {
        this.events = this.events.filter(i => i !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Neolokal Kurulum',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: { beforeStart: true, afterEnd: true },
      draggable: true,
    }
  ];

  activeDayIsOpen = true;

  dayClicked(ev: { day: MonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent }) {
  const date = ev.day.date as Date;
  const events = ev.day.events as CalendarEvent[];

  if (isSameMonth(date, this.viewDate)) {
    this.activeDayIsOpen =
      !(isSameDay(this.viewDate, date) && this.activeDayIsOpen) &&
      events.length > 0;
    this.viewDate = date;
  }
}

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent) {
    this.events = this.events.map(i =>
      i === event ? { ...event, start: newStart, end: newEnd } : i
    );
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent) {
    this.modalData = { event, action };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addEvent() {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: { beforeStart: true, afterEnd: true },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(e => e !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
