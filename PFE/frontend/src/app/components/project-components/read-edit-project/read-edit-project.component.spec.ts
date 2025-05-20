import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadEditProjectComponent } from './read-edit-project.component';

describe('ReadEditProjectComponent', () => {
  let component: ReadEditProjectComponent;
  let fixture: ComponentFixture<ReadEditProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadEditProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadEditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
