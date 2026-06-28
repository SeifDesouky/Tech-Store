import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportNavComponent } from './support-nav.component';

describe('SupportNavComponent', () => {
  let component: SupportNavComponent;
  let fixture: ComponentFixture<SupportNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
