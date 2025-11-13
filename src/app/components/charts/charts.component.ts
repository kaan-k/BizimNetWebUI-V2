import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {
  data:any;

  async ngOnInit() {
    this.data={
      labels:['Q1','Q2','Q3','Q4'],
      datasets:[{
        label:'TEST',
        data:[10,15,20,30]
      }]

    }
  }

}
