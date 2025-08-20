import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangellamadaComponent } from './changellamada.component';

describe('ChangellamadaComponent', () => {
  let component: ChangellamadaComponent;
  let fixture: ComponentFixture<ChangellamadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangellamadaComponent]
    });
    fixture = TestBed.createComponent(ChangellamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
