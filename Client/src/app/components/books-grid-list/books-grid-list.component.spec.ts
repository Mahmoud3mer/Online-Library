import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksGridListComponent } from './books-grid-list.component';

describe('BooksGridListComponent', () => {
  let component: BooksGridListComponent;
  let fixture: ComponentFixture<BooksGridListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksGridListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BooksGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
