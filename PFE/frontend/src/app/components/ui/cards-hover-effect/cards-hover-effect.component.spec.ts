import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsHoverEffectComponent } from './cards-hover-effect.component';

describe('CardsHoverEffectComponent', () => {
  let component: CardsHoverEffectComponent;
  let fixture: ComponentFixture<CardsHoverEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsHoverEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsHoverEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
