import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDrawerComponent } from './sprint-drawer.component';

describe('SprintDrawerComponent', () => {
  let component: SprintDrawerComponent;
  let fixture: ComponentFixture<SprintDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
