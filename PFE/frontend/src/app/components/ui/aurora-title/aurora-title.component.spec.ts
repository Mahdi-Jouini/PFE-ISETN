import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuroraTitleComponent } from './aurora-title.component';

describe('AuroraTitleComponent', () => {
  let component: AuroraTitleComponent;
  let fixture: ComponentFixture<AuroraTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuroraTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuroraTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
