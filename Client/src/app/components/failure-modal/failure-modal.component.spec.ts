import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureModalComponent } from './failure-modal.component';

describe('FailureModalComponent', () => {
  let component: FailureModalComponent;
  let fixture: ComponentFixture<FailureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
