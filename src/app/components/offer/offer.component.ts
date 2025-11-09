import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { Offer } from '../../models/offers/offer';
import { OfferComponentService } from '../../services/component/offer-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { changeDataTableHeight } from '../../../assets/js/main';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { NavbarOfferComponent } from './navbar-offer/navbar-offer.component';
import { AddOfferComponent } from './add-offer/add-offer.component';
import { UpdateOfferComponent } from './update-offer/update-offer.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NavbarOfferComponent, AddOfferComponent, UpdateOfferComponent,FormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"))
  offer: Offer
  offerDelete: boolean = false;
  dataLoaded: boolean = false;
  constructor(private offerComponentService: OfferComponentService, private dialog: MatDialog) { }

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'customerId', headerName: this.lang.customerName, unSortIcon: true, },
    { field: 'employeeId', headerName: this.lang.employeeName, unSortIcon: true, },
    { field: 'offerTitle', headerName: this.lang.offerTitle, unSortIcon: false},
    { field: 'offerDetails', headerName: this.lang.offerDetails, unSortIcon: false},
    { field: 'rejectionReason', headerName: this.lang.rejectionReason, unSortIcon: false},
    { field: 'totalAmount', headerName: this.lang.totalAmount, unSortIcon: false},
    { field: 'status', headerName: this.lang.status, unSortIcon: false},
    { field: 'createdAt', headerName: this.lang.createdAt, unSortIcon: false},
    { field: 'updatedAt', headerName: this.lang.updatedAt, unSortIcon: false},
    {
      field: 'Approve', headerName: this.lang.approve, filter: false, valueGetter: (params) => {
        return 'Approve';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-thumbs-up"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.approve(event.data.id),
    },
    {
      field: 'Reject', headerName: this.lang.reject, filter: false, valueGetter: (params) => {
        return 'Reject';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-thumbs-down"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.openRejectDialog(event.data.id),
    },
    {
      field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
        return 'Update';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#offerUpdateModal"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) => {
        this.getById(event.data.id)
      }
    },
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.deleteOffer(event.data.id),
    },

  ];
  public rowSelection = 'multiple';
  public defaultColDef: ColDef = {
      flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
      floatingFilter: true,
      suppressMenu: true,
      minWidth: 80,
      suppressSizeToFit: true,
    };
  public rowBuffer = 0;
  public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' =
    'infinite';
  public cacheBlockSize = 300;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 1;
  public infiniteInitialRowCount = 1000;
  public maxBlocksInCache = 10;
  public noRowsTemplate: any
  public rowData!: any[];
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['columns', 'filters'],
    defaultToolPanel: '',
  };

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllOffer()
  }

  async getAllOffer() {
    this.rowData = await this.offerComponentService.getAllOffer();
    changeDataTableHeight()
    window.addEventListener("resize", changeDataTableHeight)
    this.dataLoaded = true;

  }
  async getById(id: string) {
    this.offer = await this.offerComponentService.getById(id);
  }
  async reject(id: string, reason: string) {
    this.offer = await this.offerComponentService.reject(id, reason);
  }
  async approve(id: string) {
    this.offer = await this.offerComponentService.approve(id);
    this.getAllOffer();
  }
  openRejectDialog(id: string) {
  this.dialog.open(RejectReasonDialog, {
    width: '550px',
    panelClass: 'matdialog-delete',
  }).afterClosed().subscribe(async (reason: string | null) => { 
    if (reason && reason.trim() !== '') {
      await this.reject(id, reason);
      this.getAllOffer();
    }
  });
}
  deleteOffer(id: string) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) {
        return
      }
      this.offerComponentService.deleteOffer(id, () => { this.getAllOffer() })
    })
  }
  openDialog() {
    return this.dialog.open(OfferDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
}
@Component({
  selector: 'offer-delete-template',
  template: `
  <h5 mat-dialog-title>
    {{lang.areYouSureYouWanttoDelete}}</h5>
   <div mat-dialog-content>
   </div>
   <div mat-dialog-actions class="mat-mdc-dialog-actions">
    <button class="button-4" mat-button [mat-dialog-close]=false><i class="fa-solid fa-circle-xmark"></i> {{lang.cancel}}</button>
    <button class="button-24" mat-button [mat-dialog-close]=true cdkFocusInitial><i class="fa-solid fa-trash-can"></i> {{lang.delete}}</button>
   </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],

})
export class OfferDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<OfferDeleteTemplate>) {
  }
}

@Component({
  selector: 'reject-reason-dialog',
  template: `
    <h5 mat-dialog-title>{{lang.rejectionReason}}</h5>
    <div mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>{{lang.rejectionReason}}</mat-label>
        <textarea matInput [(ngModel)]="reason" rows="3"></textarea>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="mat-mdc-dialog-actions">
      <button mat-button class="button-4" [mat-dialog-close]="null">
        <i class="fa-solid fa-circle-xmark"></i> {{lang.cancel}}
      </button>
      <button mat-button class="button-24" [mat-dialog-close]="reason" cdkFocusInitial>
        <i class="fa-solid fa-check"></i> {{lang.approve}}
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
})
export class RejectReasonDialog {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem('lng'));
  reason: string = '';
  constructor(public dialogRef: MatDialogRef<RejectReasonDialog>) {}
}
