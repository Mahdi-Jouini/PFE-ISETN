import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueIconComponent } from './issue-icon.component';

describe('IssueIconComponent', () => {
  let component: IssueIconComponent;
  let fixture: ComponentFixture<IssueIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
