import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgreementComponent } from './add-agreement.component';

describe('AddAgreementComponent', () => {
  let component: AddAgreementComponent;
  let fixture: ComponentFixture<AddAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAgreementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
