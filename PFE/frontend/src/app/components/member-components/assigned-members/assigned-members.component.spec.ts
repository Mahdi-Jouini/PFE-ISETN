import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedMembersComponent } from './assigned-members.component';

describe('AssignedMembersComponent', () => {
  let component: AssignedMembersComponent;
  let fixture: ComponentFixture<AssignedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
