import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TroubleshootingComponent } from './troubleshooting.component';

describe('TroubleshootingComponent', () => {
  let component: TroubleshootingComponent;
  let fixture: ComponentFixture<TroubleshootingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleshootingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TroubleshootingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
