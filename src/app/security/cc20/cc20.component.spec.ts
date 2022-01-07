/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Cc20Component } from './cc20.component';

describe('Cc20Component', () => {
  let component: Cc20Component;
  let fixture: ComponentFixture<Cc20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cc20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
