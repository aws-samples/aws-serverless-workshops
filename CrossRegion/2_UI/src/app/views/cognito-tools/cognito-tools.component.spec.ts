import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitoToolsComponent } from './cognito-tools.component';

describe('CognitoToolsComponent', () => {
  let component: CognitoToolsComponent;
  let fixture: ComponentFixture<CognitoToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CognitoToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CognitoToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
