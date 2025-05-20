import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryPointInputComponent } from './story-point-input.component';

describe('StoryPointInputComponent', () => {
  let component: StoryPointInputComponent;
  let fixture: ComponentFixture<StoryPointInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryPointInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryPointInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
