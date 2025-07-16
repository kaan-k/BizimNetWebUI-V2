import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocumentFileComponent } from './update-document-file.component';

describe('UpdateDocumentFileComponent', () => {
  let component: UpdateDocumentFileComponent;
  let fixture: ComponentFixture<UpdateDocumentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDocumentFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDocumentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
