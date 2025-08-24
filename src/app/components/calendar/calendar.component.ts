import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarView,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
  CalendarEvent,
} from 'angular-calendar';
import { addHours } from 'date-fns';
import { Duty } from '../../models/duties/duty';
import { DutyComponentService } from '../../services/component/duty-component.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DutyComponent } from '../duty/duty.component';

@Component({
  selector: 'calendar-page',
  standalone: true,
  imports: [CommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();

  /** calendar data */
  events: CalendarEvent[] = [];
  loading = false;

  constructor(
    private dutyComponentService: DutyComponentService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAssignedDuties();
  }

  /** Fetch duties and map them to CalendarEvent[] */
  private loadAssignedDuties(): void {
    this.loading = true;

    try {
      const result = this.dutyComponentService.getAllDuty() as any;

      // Works whether the service returns an Observable or a Promise:
      if (result?.subscribe) {
        result.subscribe({
          next: (res: any) => this.applyDutiesResponse(res),
          error: (err: any) => this.handleLoadError(err),
          complete: () => (this.loading = false),
        });
      } else if (result?.then) {
        (result as Promise<any>)
          .then((res) => this.applyDutiesResponse(res))
          .catch((err) => this.handleLoadError(err))
          .finally(() => (this.loading = false));
      } else {
        // Unexpected return type
        this.toastr.error('Görev servisi beklenmedik bir yanıt döndürdü.');
        this.loading = false;
      }
    } catch (err) {
      this.handleLoadError(err);
      this.loading = false;
    }
  }

  /** Normalize various API shapes and map to events */
  private applyDutiesResponse(res: any): void {
    // Common API shapes: res.data (array) OR array directly
    const duties: Duty[] = Array.isArray(res) ? res : (res?.data ?? []);
    this.events = duties
      .map((d) => this.dutyToEvent(d))
      .filter((e): e is CalendarEvent => !!e);

    // Optional toast
    // this.toastr.success('Görevler yüklendi');
  }

  private handleLoadError(err: any): void {
    console.error('Failed to load duties', err);
    this.toastr.error('Görevler yüklenemedi');
    this.events = []; // still render an empty calendar
  }

  /** ==== Mapping helpers ================================================== */

  private dutyToEvent(d: Duty): CalendarEvent | null {
    try {
      const { start, end } = this.resolveTimes(d);
      const title = this.resolveTitle(d);
      const color = this.resolveColor(d);

      return {
        id: (d as any).id ?? (d as any)._id,
        title,
        start,
        end,
        color,
        allDay: false,
        meta: { duty: d },
        // enable these after wiring dnd/resizable libs if you want
        draggable: false,
        resizable: { beforeStart: false, afterEnd: false },
      };
    } catch (e) {
      console.warn('Duty could not be mapped to event:', d, e);
      return null;
    }
  }

  /** Try typical date fields; fall back to deadline; default duration = 1h */
  private resolveTimes(d: Duty): { start: Date; end: Date } {
    const a: any = d as any;

    // Adjust these property names to your real model
    const startRaw =
      a.startUtc ?? a.startDate ?? a.start ?? a.plannedDate ?? a.deadline ?? a.deadlineDate;
    const endRaw = a.endUtc ?? a.endDate ?? a.end ?? a.plannedEndDate;

    const start = startRaw ? new Date(startRaw) : new Date(); // now if missing
    const end = endRaw ? new Date(endRaw) : addHours(start, 1); // +1h if missing

    return { start, end };
  }

  private resolveTitle(d: Duty): string {
    const a: any = d as any;
    const base = a.title ?? a.name ?? 'Görev';
    const assignee = a.assignedToName ?? a.employeeName ?? a.assigneeName;
    return assignee ? `${base} — ${assignee}` : base;
  }

  private resolveColor(d: Duty): { primary: string; secondary: string } {
    const status = ((d as any).status ?? (d as any).state ?? '').toString().toLowerCase();
    if (status.includes('complete')) return { primary: '#28a745', secondary: '#d4edda' };
    if (status.includes('cancel')) return { primary: '#dc3545', secondary: '#f8d7da' };
    if (status.includes('progress')) return { primary: '#1e90ff', secondary: '#D1E8FF' };
    return { primary: '#6c757d', secondary: '#e9ecef' }; // pending / default
  }

  /** ==== UI handlers ======================================================= */

  onEventClicked({ event }: { event: CalendarEvent }): void {
    const duty = (event.meta as any)?.duty as Duty | undefined;
    if (!duty) return;
    this.dialog.open(DutyComponent, {
      data: duty,
      width: '900px',
      autoFocus: false,
    });
  }

  prev(): void {
    const d = new Date(this.viewDate);
    if (this.view === CalendarView.Month) d.setMonth(d.getMonth() - 1);
    else d.setDate(d.getDate() - (this.view === CalendarView.Week ? 7 : 1));
    this.viewDate = d;
  }

  next(): void {
    const d = new Date(this.viewDate);
    if (this.view === CalendarView.Month) d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + (this.view === CalendarView.Week ? 7 : 1));
    this.viewDate = d;
  }

  dayClicked(date: Date): void {
    this.view = CalendarView.Day;
    this.viewDate = date;
  }
}
