import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntityDialogComponent } from './new-entity-dialog.component';

describe('NewEntityDialogComponent', () => {
  let component: NewEntityDialogComponent;
  let fixture: ComponentFixture<NewEntityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEntityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
