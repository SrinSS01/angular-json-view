import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgJsonView } from './ng-json-view';

describe('NgJsonView', () => {
  let component: NgJsonView;
  let fixture: ComponentFixture<NgJsonView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgJsonView],
    }).compileComponents();

    fixture = TestBed.createComponent(NgJsonView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
