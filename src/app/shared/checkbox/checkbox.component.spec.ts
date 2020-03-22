import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { Shallow } from 'shallow-render';
import { SharedModule } from '../shared.module';

describe('CheckboxComponent', () => {
  let shallow: Shallow<CheckboxComponent>;

  beforeEach(() => {
    shallow = new Shallow(CheckboxComponent, SharedModule);
  });

  it("should display title", async () => {
    const { find } = await shallow.render();
    expect(find("mat-checkbox")).toHaveFoundOne();
  });
});
