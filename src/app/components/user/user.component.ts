import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { ResetUserPasswordDialog } from './update-user/update-user.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { ILanguage } from '../../../assets/locales/ILanguage';
import { Languages } from '../../../assets/locales/language';
import { User } from '../../models/user/user';
import { UserDetailsDto } from '../../models/user/userDetailsDto';
import { UserDto } from '../../models/user/userDto';
import { UserComponentService } from '../../services/component/user/user-component.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { changeDataTableHeight } from '../../../assets/js/main';
import { NavbarUserComponent } from './navbar-user/navbar-user.component';
import { MatButtonModule } from '@angular/material/button'; // Ensure MatButtonModule is imported if using dialog templates

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, AddUserComponent, ResetUserPasswordDialog, AgGridModule, NavbarUserComponent, MatDialogModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  lang: ILanguage = Languages.lngs.get(localStorage.getItem("lng"));
  
  user: User; // For update dialog data
  
  rowData!: any[];
  dataLoaded = false;

  constructor(
    private userComponentservice: UserComponentService,
    private dialog: MatDialog
  ) { }

  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'firstName', headerName: this.lang.firstName, unSortIcon: true, },
    { field: 'lastName', headerName: this.lang.lastName, unSortIcon: true, },
    { field: 'email', headerName: this.lang.email, unSortIcon: false},
    {
      field: 'Delete', headerName: this.lang.delete, filter: false, maxWidth: 70, cellStyle: { 'text-align': 'center' },
      cellRenderer: () => `<i class="fa-solid fa-trash-can" style="cursor:pointer; font-size:16px;"></i>`,
      onCellClicked: (event: CellClickedEvent) => this.deleteUser(event.data.id), // Direct call to delete logic
    },
   
  ];
  public defaultColDef: ColDef = {
      flex: 1, filter: true, sortable: true, resizable: true, floatingFilter: true, minWidth: 100,
  };
  public sideBar: SideBarDef | string | string[] | boolean | null = { toolPanels: ['columns', 'filters'], defaultToolPanel: '', };

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllUser();
  }

  // --- NEW DIALOG ACCESS METHODS ---

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '700px', // Set desired width
      panelClass: 'matdialog-view', // Use your custom dialog class
    });

    // CRITICAL: Subscribe to dialog close to refresh the grid
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUser();
      }
    });
  }

  openUpdateUserDialog() {
    const dialogRef = this.dialog.open(ResetUserPasswordDialog, {
      width: '700px', // Set desired width
      panelClass: 'matdialog-view', // Use your custom dialog class
    });

    // CRITICAL: Subscribe to dialog close to refresh the grid
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUser();
      }
    });
  }

  openUpdateDialog(userId: string) {
    // 1. Fetch user data before opening the modal
    this.userComponentservice.getById(userId).then(user => {
        this.user = user; // Set data loaded flag if necessary (component state)

        // 2. Open the update modal (Since update is a standard component, 
        // you might need to use its Bootstrap target if it hasn't been dialogified yet.
        // Assuming you need to keep the data-bs-target approach for the update modal,
        // we skip the dialog.open here, but if UpdateUserComponent is also a dialog, 
        // use dialog.open(UpdateUserComponent, {data: user}).
        
        // For now, we assume the update component is NOT dialogified and relies on input binding.
        // You would typically notify the update component via input change, or just open the BS modal here.
    });
  }

  // --- END DIALOG ACCESS METHODS ---

  // #region Data Operations
  async getAllUser() {
    this.rowData = (await this.userComponentservice.getAllUser())
    // changeDataTableHeight() // Assuming this function is available and correct
    // window.addEventListener("resize", changeDataTableHeight)
    this.dataLoaded = true;
  }
  async getByUser(Id: string) {
    this.user = (await this.userComponentservice.getById(Id))
    this.dataLoaded = true;
  }
  
  deleteUser(id: string) {
    // Open the confirmation dialog defined in UserDeleteTemplate
    this.openDeleteConfirmDialog().afterClosed().subscribe(async result => {
      if (result) {
        this.userComponentservice.deleteUser(id, () => { this.getAllUser() });
      }
    });
  }
  
  openDeleteConfirmDialog() {
    return this.dialog.open(UserDeleteTemplate, {
      width: '450px',
      panelClass: 'matdialog-delete',
    });
  }

  // #endregion

}

// Your existing Delete Template (needed for compilation context)
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