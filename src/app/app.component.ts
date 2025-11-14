import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddCalendarComponent } from "./components/calendar/add-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, AddCalendarComponent],
  //template: `<add-calendar></add-calendar>`,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BizimNetWebUI-V2';
}
