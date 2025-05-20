import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneesAvatarGroupComponent } from './assignees-avatar-group.component';

describe('AssigneesAvatarGroupComponent', () => {
  let component: AssigneesAvatarGroupComponent;
  let fixture: ComponentFixture<AssigneesAvatarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneesAvatarGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneesAvatarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
