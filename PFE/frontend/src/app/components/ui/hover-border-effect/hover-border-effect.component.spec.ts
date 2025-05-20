import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverBorderEffectComponent } from './hover-border-effect.component';

describe('HoverBorderEffectComponent', () => {
  let component: HoverBorderEffectComponent;
  let fixture: ComponentFixture<HoverBorderEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverBorderEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoverBorderEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
