import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadEditSprintComponent } from './read-edit-sprint.component';

describe('ReadEditSprintComponent', () => {
  let component: ReadEditSprintComponent;
  let fixture: ComponentFixture<ReadEditSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadEditSprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadEditSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
