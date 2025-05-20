import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumBoardIssueComponent } from './scrum-board-issue.component';

describe('ScrumBoardIssueComponent', () => {
  let component: ScrumBoardIssueComponent;
  let fixture: ComponentFixture<ScrumBoardIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumBoardIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumBoardIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
