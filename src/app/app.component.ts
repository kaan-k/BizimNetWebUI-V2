import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,CalendarComponent],
  template: `<calendar-page></calendar-page>`,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BizimNetWebUI-V2';
}
