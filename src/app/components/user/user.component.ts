import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AgGridModule } from 'ag-grid-angular';
import { faArrowRightLong, faInfo, faUsers, faUser, faPen, faTrashCan, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { User } from '../../models/user/user';
import { UserDetailsDto } from '../../models/user/userDetailsDto';
import { UserDto } from '../../models/user/userDto';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { changeDataTableHeight } from '../../../assets/js/main';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, AddUserComponent, UpdateUserComponent, AgGridModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  //Class
  users: User[];
  userDetails: UserDetailsDto[]
  userDetailImage: UserDetailsDto
  userDetail: User;
  user: User;
  userDto: UserDto

  //Form
  userId: string;
  id: string
  imageId: string

  //Flag
  dataLoaded = false;
  userDeleteId = false;
  isuserLoad = false;



  constructor(
    private userComponentservice: UserComponentService,
    private dialog: MatDialog
  ) { }

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'companyName', headerName: this.lang.companyName, unSortIcon: true, },
    { field: 'companyAddress', headerName: this.lang.companyAddress, unSortIcon: true, },
    { field: 'email', headerName: this.lang.email, unSortIcon: true },
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.onDeleteUserId(event.data.id),
    },
    {
      field: 'Update', headerName: this.lang.update, filter: false, valueGetter: (params) => {
        return 'Update';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#updateModal"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) => {
        this.getByUser(event.data.id)
      }
    },
  ];
  public rowSelection = 'multiple';
  public defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 130,
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
    this.getAllUser()
  }

  //#region  Get Method

  async getAllUser() {
    this.rowData = (await this.userComponentservice.getAllUser())
    changeDataTableHeight()
    window.addEventListener("resize", changeDataTableHeight)
    this.dataLoaded = true;
  }
  async getByUser(Id: string) {
    this.user = (await this.userComponentservice.getById(Id))
    this.dataLoaded = true;
    this.isuserLoad = true;
  }
  async getImagesByUserId(Id: string) {
    this.userDetailImage = (await this.userComponentservice.getImagesByUserId(Id))
    this.dataLoaded = true;
    this.isuserLoad = true;
  }

  //#endregion

  //#region on and Delete method

  onDeleteUserId(id: string) {
    this.userId = id;
    this.userDeleteId = true;
    this.deleteUser(id)
  }
  deleteUser(id: string) {
    if (this.userDeleteId) {
      this.openDialog().afterClosed().subscribe(async result => {
        if (!result) {
          return
        }
        this.userComponentservice.deleteUser(id, () => { this.getAllUser() })
      })
    }
  }
  openDialog() {
    return this.dialog.open(UserDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
  async onDetailModalClicked(id: string) {
    this.userDto = (await this.userComponentservice.getImagesByUserId(id));
    this.isuserLoad = true;
  }

  //#endregion


}
//#region delete Component
@Component({
  selector: 'user-delete-template',
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
export class UserDeleteTemplate {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));

  constructor(public dialogRef: MatDialogRef<UserDeleteTemplate>) {
  }
}
//#endregion