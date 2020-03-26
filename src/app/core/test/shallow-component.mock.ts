import { DebugElement } from '@angular/core';
import { IShallowTestComponent } from './shallow-test-component.interface';
import { QueryMatch } from 'shallow-render/dist/lib/models/query-match';

export abstract class ShallowComponentMock {
  constructor(
    private elementSelector: string,
    private shallowComponent: IShallowTestComponent
  ) {}

  get el(): QueryMatch<DebugElement> {
    return this.shallowComponent.find(this.elementSelector);
  }

  protected async detectChanges(): Promise<void> {
    await this.shallowComponent.detectChanges();
  }
}
