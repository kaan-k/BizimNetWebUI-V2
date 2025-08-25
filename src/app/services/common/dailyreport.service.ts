import { Injectable } from '@angular/core';
import BizimNetHttpClientService from '../bizimNetHttpClient/bizim-net-http-client.service';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../../models/listResponseModel';
import { Duty } from '../../models/duties/duty';

@Injectable({
  providedIn: 'root'
})
export class DailyReportService extends BizimNetHttpClientService {

  private _controller = 'PdfTesting';

  // Calls: [HttpPost("Add")] => returns _dutyService.GetTodaysDuties();
  add(): Observable<ListResponseModel<Duty>> {
    // no payload required; sending {} keeps your base client happy
    return this.post<ListResponseModel<Duty>>(
      { controller: this._controller, action: 'Add' },
      {}
    );
  }
}
