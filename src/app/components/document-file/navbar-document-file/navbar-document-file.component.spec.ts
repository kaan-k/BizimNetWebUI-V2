import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDocumentFileComponent } from './navbar-document-file.component';

describe('NavbarDocumentFileComponent', () => {
  let component: NavbarDocumentFileComponent;
  let fixture: ComponentFixture<NavbarDocumentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDocumentFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarDocumentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
