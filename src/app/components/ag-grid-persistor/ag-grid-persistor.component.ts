import { Component, EventEmitter, Output } from '@angular/core';
import { AgGridSettings } from '../../services/common/ag-grid-settings.service';
import { AgGridSettingsComponentService } from '../../services/component/ag-grid-settings-component-service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ag-grid-persistor',
  standalone: true,
  imports: [],
  templateUrl: './ag-grid-persistor.component.html',
  styleUrl: './ag-grid-persistor.component.css'
})
export class AgGridPersistorComponent {
 settingForm:FormGroup
   @Output() settingEvent = new EventEmitter<any>();p
  formBuilder: any;
  constructor(private agGridSettingsService: AgGridSettings) { }
  
createSettingForm() {
    this.settingForm = this.formBuilder.group({
      name: [''],
    });
  }
  
   addSetting(){
    if(this.settingForm.valid){
      const model = Object.assign({}, this.settingForm.value)
      console.log(model);
      this.agGridSettingsService.addSetting(model,()=>{
        this.settingEvent.emit(true)
      })
    }
  }

}


