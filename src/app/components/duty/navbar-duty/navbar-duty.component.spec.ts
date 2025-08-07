import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDutyComponent } from './navbar-duty.component';

describe('NavbarDutyComponent', () => {
  let component: NavbarDutyComponent;
  let fixture: ComponentFixture<NavbarDutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDutyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
