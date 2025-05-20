import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFileInputComponent } from './dynamic-file-input.component';

describe('DynamicFileInputComponent', () => {
  let component: DynamicFileInputComponent;
  let fixture: ComponentFixture<DynamicFileInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFileInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
