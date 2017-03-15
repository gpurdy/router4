/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CubenadoComponent } from './cubenado.component';

describe('CubenadoComponent', () => {
  let component: CubenadoComponent;
  let fixture: ComponentFixture<CubenadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubenadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubenadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
