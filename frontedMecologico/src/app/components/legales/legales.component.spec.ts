import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalesComponent } from './legales.component';

describe('LegalesComponent', () => {
  let component: LegalesComponent;
  let fixture: ComponentFixture<LegalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
