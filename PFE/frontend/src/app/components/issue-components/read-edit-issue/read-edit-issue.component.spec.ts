import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadEditIssueComponent } from './read-edit-issue.component';

describe('ReadEditIssueComponent', () => {
  let component: ReadEditIssueComponent;
  let fixture: ComponentFixture<ReadEditIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadEditIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadEditIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
