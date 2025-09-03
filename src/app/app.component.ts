import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AddCalendarComponent } from "./components/calendar/add-calendar/add-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CalendarComponent, AddCalendarComponent],
  //template: `<add-calendar></add-calendar>`,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BizimNetWebUI-V1';
}
